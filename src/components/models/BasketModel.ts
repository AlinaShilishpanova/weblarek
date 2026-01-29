import { IProduct } from '../../types';

export class BasketModel {
    private items: IProduct[] = [];

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(item: IProduct): void {
        if (!this.contains(item.id)) {
            this.items.push(item);
        }
    }

    removeItem(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
    }

    clearBasket(): void {
        this.items = [];
    }

    getTotal(): number {
        return this.items.reduce((total, item) => total + (item.price || 0), 0);
    }

    getCount(): number {
        return this.items.length;
    }

    contains(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}