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

import { API_URL, CDN_URL } from './utils/constants';
import { IOrder, IBuyer } from './types';

const events = new EventEmitter();
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

const productModel = new ProductModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const appModal = new Modal(ensureElement<HTMLElement>('#modal-container'));
const header = new Header(ensureElement<HTMLElement>('.header'));
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));

const basketModal = new BasketModal(cloneTemplate<HTMLElement>(basketTemplate));
const orderForm = new OrderForm(cloneTemplate<HTMLElement>(orderTemplate));
const contactsForm = new ContactsForm(cloneTemplate<HTMLElement>(contactsTemplate));
const successModal = new SuccessModal(cloneTemplate<HTMLElement>(successTemplate));

let currentModalContent: 'basket' | 'order' | 'contacts' | 'success' | 'preview' | null = null;

// ОБРАБОТЧИКИ СОБЫТИЙ

webLarekApi.getProductList()
    .then((products) => {
        productModel.setItems(products);
    })
    .catch((error) => {
        console.error('Ошибка загрузки каталога:', error);
    });

productModel.on('catalog:changed', () => {
    const items = productModel.getItems();
    const catalogCards = items.map((item) => {
        const card = new CatalogCard(cloneTemplate<HTMLElement>(cardCatalogTemplate));
        return card.render({
            ...item,
            onClick: (id: string) => {
                const product = productModel.getItem(id);
                if (product) {
                    productModel.setPreviewItem(product);
                    currentModalContent = 'preview';
                }
            }
        });
    });
    gallery.render({ items: catalogCards });
});

productModel.on('preview:changed', () => {
    const product = productModel.getPreviewItem();
    if (product && currentModalContent === 'preview') {
        const previewCard = new PreviewCard(cloneTemplate<HTMLElement>(cardPreviewTemplate));
        appModal.content = previewCard.render({
            ...product,
            inBasket: basketModel.contains(product.id),
            onAddToBasket: (id: string) => {
                const item = productModel.getItem(id);
                if (item) {
                    basketModel.addItem(item);
                    appModal.close();
                    currentModalContent = null;
                }
            },
            onRemoveFromBasket: (id: string) => {
                basketModel.removeItem(id);
                appModal.close();
                currentModalContent = null;
            }
        });
        appModal.open();
    }
});

basketModel.on('basket:changed', () => {
    header.counter = basketModel.getCount();
    
    if (currentModalContent === 'basket') {
        updateBasketModal();
    }
});

header.basketButtonHandler = () => {
    currentModalContent = 'basket';
    updateBasketModal();
    appModal.content = basketModal.render();
    appModal.open();
};

orderForm.container.addEventListener('payment:change', (event: Event) => {
    const customEvent = event as CustomEvent;
    buyerModel.setData({ payment: customEvent.detail.payment });
});

orderForm.container.addEventListener('order:submit', (event: Event) => {
    const customEvent = event as CustomEvent;
    buyerModel.setData({
        payment: customEvent.detail.payment,
        address: customEvent.detail.address
    });
    
    currentModalContent = 'contacts';
    updateContactsForm();
    appModal.content = contactsForm.render();
});

contactsForm.container.addEventListener('contacts:submit', (event: Event) => {
    const customEvent = event as CustomEvent;
    buyerModel.setData({
        email: customEvent.detail.email,
        phone: customEvent.detail.phone
    });
    
    sendOrder();
});

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ

function updateBasketModal() {
    const items = basketModel.getItems();
    const basketItems = items.map((item, index) => {
        const card = new BasketItemCard(cloneTemplate<HTMLElement>(cardBasketTemplate));
        return card.render({
            ...item,
            index,
            onRemove: (id: string) => {
                basketModel.removeItem(id);
            }
        });
    });
    
    basketModal.render({
        items: basketItems,
        total: basketModel.getTotal(),
        onCheckout: () => {
            if (basketModel.getCount() > 0) {
                currentModalContent = 'order';
                buyerModel.clearData();
                updateOrderForm();
                appModal.content = orderForm.render();
            }
        }
    });
}

function updateOrderForm() {
    const data = buyerModel.getData();
    
    const errorMessages: string[] = [];
    
    if (!data.payment) {
        errorMessages.push('Не выбран способ оплаты');
    }
    
    if (!data.address || data.address.trim() === '') {
        errorMessages.push('Не указан адрес доставки');
    }
    
    orderForm.render({
        payment: data.payment,
        address: data.address
    });
    
    orderForm.errors = errorMessages;
}

function updateContactsForm() {
    const data = buyerModel.getData();
    
    const errorMessages: string[] = [];
    
    if (!data.email || data.email.trim() === '') {
        errorMessages.push('Не указан email');
    }
    
    if (!data.phone || data.phone.trim() === '') {
        errorMessages.push('Не указан телефон');
    }
    
    contactsForm.render({
        email: data.email,
        phone: data.phone
    });
    
    contactsForm.errors = errorMessages;
}

async function sendOrder() {
    const buyerData = buyerModel.getData();
    const basketItems = basketModel.getItems();
    
    if (!buyerData.payment || 
        !buyerData.address || buyerData.address.trim() === '' ||
        !buyerData.email || buyerData.email.trim() === '' ||
        !buyerData.phone || buyerData.phone.trim() === '') {
        alert('Пожалуйста, заполните все поля');
        return;
    }
    
    const order: IOrder = {
        ...buyerData,
        total: basketModel.getTotal(),
        items: basketItems.map(item => item.id)
    };
    
    try {
        const result = await webLarekApi.submitOrder(order);
        
        currentModalContent = 'success';
        successModal.render({
            total: result.total,
            onClose: () => {
                basketModel.clearBasket();
                buyerModel.clearData();
                appModal.close();
                currentModalContent = null;
            }
        });
        
        appModal.content = successModal.render();
        
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
        alert('Произошла ошибка при оформлении заказа. Попробуйте еще раз.');
    }
}

header.counter = basketModel.getCount();