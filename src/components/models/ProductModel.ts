import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class ProductModel extends EventEmitter {
    private items: IProduct[] = [];
    private preview: IProduct | null = null;

    setItems(items: IProduct[]): void {
        this.items = items;
        this.emit('catalog:changed');
    }

    getItems(): IProduct[] {
        return [...this.items];
    }

    getItem(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    setPreviewItem(item: IProduct): void {
        this.preview = item;
        this.emit('preview:changed');
    }

    getPreviewItem(): IProduct | null {
        return this.preview;
    }
}