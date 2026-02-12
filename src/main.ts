import './scss/styles.scss';

import { Api } from './components/base/Api';
import { WebLarekApi } from './components/api/WebLarekApi';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct } from './types'

// МОДЕЛИ
import { ProductModel } from './components/models/ProductModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';

// БАЗОВЫЕ КОМПОНЕНТЫ
import { Modal } from './components/views/Modal';

// КОМПОНЕНТЫ ПРЕДСТАВЛЕНИЯ
import { Header } from './components/views/Header';
import { Gallery } from './components/views/Gallery';
import { CatalogCard } from './components/views/CatalogCard';
import { PreviewCard } from './components/views/PreviewCard';
import { BasketItemCard } from './components/views/BasketItemCard';
import { BasketModal } from './components/views/BasketModal';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { SuccessModal } from './components/views/SuccessModal';

// КОНСТАНТЫ
import { API_URL, CDN_URL } from './utils/constants';
import { IOrder } from './types';

// ИНИЦИАЛИЗАЦИЯ
const events = new EventEmitter();
const api = new Api(API_URL);
const larekApi = new WebLarekApi(api);

// МОДЕЛИ ДАННЫХ
const productModel = new ProductModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();

// ШАБЛОНЫ
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// КОМПОНЕНТЫ ПРЕДСТАВЛЕНИЯ
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'));
const header = new Header(ensureElement<HTMLElement>('.header'), events);
const gallery = new Gallery(ensureElement('.gallery') as any);

const basketModal = new BasketModal(cloneTemplate(basketTemplate));
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const successModal = new SuccessModal(cloneTemplate(successTemplate));

// ПОДПИСКА НА СОБЫТИЯ МОДЕЛЕЙ
events.on('catalog:changed', () => {
    const items = productModel.getItems();
    const cards = items.map((item: any) => {
        const card = new CatalogCard(
            cloneTemplate(cardCatalogTemplate),
            (id) => events.emit('card:select', { id })
        );
        return card.render(item);
    });
    gallery.render({ items: cards });
});

events.on('preview:changed', () => {
    const product = productModel.getPreviewItem();
    if (!product) return;

    const buttonText = product.price === null 
        ? 'Недоступно' 
        : basketModel.contains(product.id) 
            ? 'Удалить из корзины' 
            : 'В корзину';
    
    const buttonDisabled = product.price === null;

    const previewCard = new PreviewCard(
        cloneTemplate(cardPreviewTemplate),
        (id: string) => {
            const product = productModel.getItem(id);
            if (!product) return;
            
            if (basketModel.contains(id)) {
                basketModel.removeItem(id);
                modal.close();
            } else {
                basketModel.addItem(product);
                modal.close();
            }
        }
    );

    modal.content = previewCard.render({
        ...product,
        buttonText,
        buttonDisabled,
        inBasket: basketModel.contains(product.id)
    });
    modal.open();
});

events.on('basket:changed', () => {
    header.counter = basketModel.getCount();

    const items = basketModel.getItems();
    const basketItems = items.map((item, index) => {
        const card = new BasketItemCard(cloneTemplate(cardBasketTemplate));
        return card.render({
            ...item,
            index,
            onRemove: (id: string) => basketModel.removeItem(id)
        });
    });

    basketModal.render({
        items: basketItems,
        total: basketModel.getTotal(),
        onCheckout: () => events.emit('basket:checkout')
    });
});

events.on('buyer:changed', () => {
    const orderData = buyerModel.getData();
    orderForm.render({
        payment: orderData.payment,
        address: orderData.address
    });
    
    const orderValidation = buyerModel.validatePaymentAndAddress();
    orderForm.errors = orderValidation.errors;
    
    const orderButton = orderForm['_submitButton'] as HTMLButtonElement;
    if (orderButton) orderButton.disabled = !orderValidation.isValid;

    const contactsData = buyerModel.getData();
    contactsForm.render({
        email: contactsData.email,
        phone: contactsData.phone
    });

    const contactsValidation = buyerModel.validateContacts();
    contactsForm.errors = contactsValidation.errors;
    
    const contactsButton = contactsForm['_submitButton'] as HTMLButtonElement;
    if (contactsButton) contactsButton.disabled = !contactsValidation.isValid;
});

// ПОДПИСКА НА СОБЫТИЯ ПРЕДСТАВЛЕНИЙ
events.on('card:select', ({ id }: { id: string }) => {
    const product = productModel.getItem(id);
    if (product) {
        productModel.setPreviewItem(product);
    }
});

events.on('basket:open', () => {
    modal.content = basketModal.render();
    modal.open();
});

events.on('basket:checkout', () => {
    buyerModel.clearData();
    modal.content = orderForm.render();
    modal.open();
});

events.on('order:select-payment', ({ payment }: { payment: 'card' | 'cash' }) => {
    buyerModel.setData({ payment });
});

events.on('order:change-address', ({ address }: { address: string }) => {
    buyerModel.setData({ address });
});

events.on('order:submit', () => {
    const validation = buyerModel.validatePaymentAndAddress();
    if (validation.isValid) {
        modal.content = contactsForm.render();
    }
});

events.on('contacts:change-email', ({ email }: { email: string }) => {
    buyerModel.setData({ email });
});

events.on('contacts:change-phone', ({ phone }: { phone: string }) => {
    buyerModel.setData({ phone });
});

events.on('contacts:submit', async () => {
    const validation = buyerModel.validateContacts();
    if (!validation.isValid) return;

    const buyerData = buyerModel.getData();
    const basketItems = basketModel.getItems();

    const order: IOrder = {
        payment: buyerData.payment!,
        email: buyerData.email,
        phone: buyerData.phone,
        address: buyerData.address,
        total: basketModel.getTotal(),
        items: basketItems.map(item => item.id)
    };

    try {
        const result = await larekApi.submitOrder(order);

        successModal.render({
            total: result.total,
            onClose: () => {
                basketModel.clearBasket();
                buyerModel.clearData();
                modal.close();
            }
        });
        
        modal.content = successModal.render();
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
        contactsForm.errors = ['Не удалось оформить заказ. Попробуйте позже.'];
    }
});

// ЗАГРУЗКА НАЧАЛЬНЫХ ДАННЫХ
larekApi.getProductList()
    .then(products => {
        productModel.setItems(products);
    })
    .catch(error => {
        console.error('Ошибка загрузки каталога:', error);
    });

header.counter = basketModel.getCount();