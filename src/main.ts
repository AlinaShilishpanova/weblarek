import './scss/styles.scss';

import { Api } from './components/base/Api';
import { WebLarekApi } from './components/api/WebLarekApi';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, ensureElement } from './utils/utils';

import { ProductModel } from './components/models/ProductModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';

import { Modal } from './components/views/Modal';
import { Header } from './components/views/Header';
import { Gallery } from './components/views/Gallery';
import { CatalogCard } from './components/views/CatalogCard';
import { PreviewCard } from './components/views/PreviewCard';
import { BasketItemCard } from './components/views/BasketItemCard';
import { BasketModal } from './components/views/BasketModal';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { SuccessModal } from './components/views/SuccessModal';

import { API_URL } from './utils/constants';
import { IOrder } from './types';

// 1. ИНИЦИАЛИЗАЦИЯ БАЗОВЫХ КОМПОНЕНТОВ
const events = new EventEmitter();
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

// 2. ИНИЦИАЛИЗАЦИЯ МОДЕЛЕЙ ДАННЫХ
const productModel = new ProductModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();

// 3. ПОЛУЧЕНИЕ ТЕМПЛЕЙТОВ
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// 4. ИНИЦИАЛИЗАЦИЯ КОМПОНЕНТОВ ПРЕДСТАВЛЕНИЯ
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'));
const header = new Header(events, ensureElement<HTMLElement>('.header'));
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));

const basketModal = new BasketModal(
    cloneTemplate<HTMLElement>(basketTemplate),
    () => events.emit('checkout:start')
);

const orderForm = new OrderForm(
    events,
    cloneTemplate<HTMLElement>(orderTemplate)
);

const contactsForm = new ContactsForm(
    events,
    cloneTemplate<HTMLElement>(contactsTemplate)
);

const successModal = new SuccessModal(
    cloneTemplate<HTMLElement>(successTemplate),
    () => {
        basketModel.clearBasket();
        buyerModel.clearData();
        modal.close();
    }
);

// 5. ЗАГРУЗКА ДАННЫХ С СЕРВЕРА
webLarekApi.getProductList()
    .then((products) => {
        productModel.setItems(products);
    })
    .catch((error) => {
        console.error('Ошибка загрузки каталога:', error);
    });

// 6. ОБРАБОТЧИКИ СОБЫТИЙ МОДЕЛЕЙ ДАННЫХ
productModel.on('catalog:changed', () => {
    const items = productModel.getItems();
    const catalogCards = items.map((item) => {
        const card = new CatalogCard(
            cloneTemplate<HTMLElement>(cardCatalogTemplate),
            () => events.emit('card:select', { id: item.id })
        );
        card.title = item.title;
        card.category = item.category;
        card.image = item.image;
        card.price = item.price;
        return card.render();
    });
    gallery.items = catalogCards;
});

productModel.on('preview:changed', () => {
    const product = productModel.getPreviewItem();
    if (product) {
        const previewCard = new PreviewCard(cloneTemplate<HTMLElement>(cardPreviewTemplate));
        
        previewCard.title = product.title;
        previewCard.description = product.description;
        previewCard.category = product.category;
        previewCard.image = product.image;
        previewCard.price = product.price;
        
        const inBasket = basketModel.contains(product.id);
        if (product.price === null) {
            previewCard.buttonText = 'Недоступно';
            previewCard.buttonDisabled = true;
        } else if (inBasket) {
            previewCard.buttonText = 'Удалить из корзины';
            previewCard.buttonDisabled = false;
            previewCard.onButtonClick = () => {
                basketModel.removeItem(product.id);
                modal.close();
            };
        } else {
            previewCard.buttonText = 'В корзину';
            previewCard.buttonDisabled = false;
            previewCard.onButtonClick = () => {
                basketModel.addItem(product);
                modal.close();
            };
        }
        
        modal.content = previewCard.render();
        modal.open();
    }
});

basketModel.on('basket:changed', () => {
    header.counter = basketModel.getCount();
    
    const items = basketModel.getItems();
    const basketItems = items.map((item, index) => {
        const card = new BasketItemCard(
            cloneTemplate<HTMLElement>(cardBasketTemplate),
            () => basketModel.removeItem(item.id)
        );
        card.title = item.title;
        card.price = item.price;
        card.index = index;
        return card.render();
    });
    
    basketModal.items = basketItems;
    basketModal.total = basketModel.getTotal();
    basketModal.buttonDisabled = items.length === 0;
});

buyerModel.on('buyer:changed', () => {
    const data = buyerModel.getData();
    const validation = buyerModel.validate();
    
    orderForm.payment = data.payment;
    orderForm.address = data.address;
    orderForm.valid = !validation.errors.payment && !validation.errors.address;
    orderForm.errors = [validation.errors.payment, validation.errors.address]
        .filter(Boolean)
        .join(', ');
    
    contactsForm.email = data.email;
    contactsForm.phone = data.phone;
    contactsForm.valid = !validation.errors.email && !validation.errors.phone;
    contactsForm.errors = [validation.errors.email, validation.errors.phone]
        .filter(Boolean)
        .join(', ');
});

// 7. ОБРАБОТЧИКИ СОБЫТИЙ ПРЕДСТАВЛЕНИЙ
events.on('card:select', (data: { id: string }) => {
    const product = productModel.getItem(data.id);
    if (product) {
        productModel.setPreviewItem(product);
    }
});

events.on('basket:open', () => {
    modal.content = basketModal.render();
    modal.open();
});

events.on('checkout:start', () => {
    buyerModel.clearData();
    modal.content = orderForm.render();
    modal.open();
});

events.on('order:select-payment', (data: { payment: 'card' | 'cash' }) => {
    buyerModel.setData({ payment: data.payment });
});

events.on('orderform:change', (data: { field: string; value: string }) => {
    if (data.field === 'address') {
        buyerModel.setData({ address: data.value });
    }
});

events.on('orderform:submit', () => {
    const validation = buyerModel.validate();
    if (!validation.errors.payment && !validation.errors.address) {
        modal.content = contactsForm.render();
    }
});

events.on('contactsform:change', (data: { field: string; value: string }) => {
    if (data.field === 'email') {
        buyerModel.setData({ email: data.value });
    } else if (data.field === 'phone') {
        buyerModel.setData({ phone: data.value });
    }
});

events.on('contactsform:submit', () => {
    const validation = buyerModel.validate();
    if (validation.isValid) {
        const order: IOrder = {
            ...buyerModel.getData(),
            total: basketModel.getTotal(),
            items: basketModel.getItems().map(item => item.id)
        };
        
        webLarekApi.submitOrder(order)
            .then((result) => {
                successModal.total = result.total;
                modal.content = successModal.render();
            })
            .catch((error) => {
                console.error('Ошибка при оформлении заказа:', error);
                const validation = buyerModel.validate();
                contactsForm.valid = false;
                contactsForm.errors = 'Произошла ошибка при оформлении заказа';
            });
    }
});

// 8. ИНИЦИАЛИЗАЦИЯ НАЧАЛЬНОГО СОСТОЯНИЯ
header.counter = basketModel.getCount();