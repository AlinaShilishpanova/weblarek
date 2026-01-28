import { Api } from '../base/Api';
import { IProduct, IOrder, IOrderResult, IApi } from '../../types';

export class WebLarekApi implements IApi {
    constructor(protected api: Api) {}

    // Получить список товаров
    async getProductList(): Promise<IProduct[]> {
        const response = await this.api.get<{ items: IProduct[] }>('/product/');
        return response.items;
    }

    // Отправить заказ
    async submitOrder(order: IOrder): Promise<IOrderResult> {
        return await this.api.post<IOrderResult>('/order/', order);
    }

    // Реализация интерфейса IApi (для совместимости)
    get<T extends object>(uri: string): Promise<T> {
        return this.api.get<T>(uri);
    }

    post<T extends object>(uri: string, data: object, method?: 'POST' | 'PUT' | 'DELETE'): Promise<T> {
        return this.api.post<T>(uri, data, method);
    }
}