import { Card } from './Card';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';

interface IBasketItemCardData extends IProduct {
    index: number;
    onRemove: (id: string) => void;
}

export class BasketItemCard extends Card<IBasketItemCardData> {
    private indexElement: HTMLElement;
    private deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
    }

    set index(value: number) {
        this.indexElement.textContent = String(value + 1);
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set price(value: number | null) {
        this.setPrice(value);
    }

    set onRemove(handler: (id: string) => void) {
        this.deleteButton.addEventListener('click', () => {
            handler(this.id);
        });
    }

    render(data: IBasketItemCardData): HTMLElement {
        super.render(data);
        this.index = data.index;
        this.onRemove = data.onRemove;
        return this.container;
    }
}