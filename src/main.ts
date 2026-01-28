import './scss/styles.scss';

import { apiProducts } from './utils/data';

import { ProductModel } from './components/models/ProductModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';

import { Api } from './components/base/Api';
import { WebLarekApi } from './components/api/WebLarekApi';
import { API_URL } from './utils/constants';

// ТЕСТИРОВАНИЕ

console.log('=== Тестирование моделей данных (локальные данные) ===');

const productModel = new ProductModel();
productModel.setItems(apiProducts.items);
console.log('Каталог товаров:', productModel.getItems());
console.log('Товар с ID c101...:', productModel.getItem('c101ab44-ed99-4a54-990d-47aa2bb4e7d9'));

const basketModel = new BasketModel();
const [product1, product2] = apiProducts.items.slice(0, 2);
basketModel.addItem(product1);
basketModel.addItem(product2);
console.log('Корзина:', basketModel.getItems());
console.log('Сумма в корзине:', basketModel.getTotal());
console.log('Количество товаров:', basketModel.getCount());

const buyerModel = new BuyerModel();
buyerModel.setData({ email: 'test@mail.ru', address: 'Москва' });
console.log('Данные покупателя:', buyerModel.getData());
console.log('Ошибки валидации:', buyerModel.validate());

// РАБОТА С СЕРВЕРОМ

console.log('=== Тестирование работы с сервером ===');

const baseApi = new Api(API_URL);
const webLarekApi = new WebLarekApi(baseApi);

webLarekApi.getProductList()
    .then((products) => {
        console.log('Товары с сервера:', products);
        
        productModel.setItems(products);
        console.log('Товары в модели после загрузки с сервера:', productModel.getItems());
        console.log('Количество товаров с сервера:', products.length);
        
        if (products.length > 0) {
            console.log('Первый товар с сервера:', products[0]);
        }
    })
    .catch((error) => {
        console.error('Ошибка при загрузке товаров:', error);
    });