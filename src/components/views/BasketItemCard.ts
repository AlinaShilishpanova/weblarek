import { Card } from './Card';
import { ensureElement } from '../../utils/utils';

interface IBasketItemCardData {
    id: string;
    title: string;
    price: number | null;
    index: number;
    onRemove: () => void;
}

export class BasketItemCard extends Card<IBasketItemCardData> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, onRemove: () => void) {
        super(container);
        
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        
        this.deleteButton.addEventListener('click', onRemove);
    }

    set index(value: number) {
        this.indexElement.textContent = String(value + 1);
    }
}