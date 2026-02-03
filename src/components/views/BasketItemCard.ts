import { Card } from './Card';
import { IProduct } from '../../types';

interface IBasketItemCardData extends IProduct {
    index: number;
    onRemove: (id: string) => void;
}

export class BasketItemCard extends Card<IBasketItemCardData> {
    private _indexElement: HTMLElement;
    private _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        const indexEl = container.querySelector('.basket__item-index');
        const deleteBtn = container.querySelector('.basket__item-delete');
        
        if (!indexEl) throw new Error('Элемент .basket__item-index не найден');
        if (!deleteBtn) throw new Error('Элемент .basket__item-delete не найден');
        
        this._indexElement = indexEl as HTMLElement;
        this._deleteButton = deleteBtn as HTMLButtonElement;
    }

    render(data: IBasketItemCardData): HTMLElement {
        super.render(data);
        
        this.setText(this._title, data.title);
        this.setPrice(data.price);
        this.setText(this._indexElement, String(data.index + 1));
        
        this._deleteButton.addEventListener('click', () => {
            data.onRemove(data.id);
        });

        return this.container;
    }
}