import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class BasketModel extends EventEmitter {
    private items: IProduct[] = [];

    getItems(): IProduct[] {
        return [...this.items];
    }

    addItem(item: IProduct): void {
        if (!this.contains(item.id)) {
            this.items.push(item);
            this.emit('basket:changed', { items: [...this.items] });
        }
    }

    removeItem(id: string): void {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.emit('basket:changed', { items: [...this.items] });
        }
    }

    clearBasket(): void {
        this.items = [];
        this.emit('basket:changed', { items: [...this.items] });
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