import { Api } from '../base/Api';
import { IProduct, IOrder, IOrderResult, IApi } from '../../types';

export class WebLarekApi {
    constructor(protected api: IApi) {}
    
    // Получить список товаров
    async getProductList(): Promise<IProduct[]> {
        const response = await this.api.get<{ items: IProduct[] }>('/product/');
        return response.items;
    }

    // Отправить заказ
    async submitOrder(order: IOrder): Promise<IOrderResult> {
        return await this.api.post<IOrderResult>('/order/', order);
    }
}