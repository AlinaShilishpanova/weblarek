import { IProduct } from '../../types';

export class BasketModel {
    private _items: IProduct[] = [];

    getItems(): IProduct[] {
        return this._items;
    }

    addItem(item: IProduct): void {
        if (!this._items.some(basketItem => basketItem.id === item.id)) {
            this._items.push(item);
        }
    }

    removeItem(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
    }

    clearBasket(): void {
        this._items = [];
    }

    getTotal(): number {
        return this._items.reduce((total, item) => total + (item.price || 0), 0);
    }

    getCount(): number {
        return this._items.length;
    }

    contains(id: string): boolean {
        return this._items.some(item => item.id === id);
    }
}