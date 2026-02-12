import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface IBasketModalData {
    items: HTMLElement[];
    total: number;
    onCheckout: () => void;
}

export class BasketModal extends Component<IBasketModalData> {
    private list: HTMLElement;
    private totalElement: HTMLElement;
    private checkoutButton: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this.list = ensureElement<HTMLElement>('.basket__list', container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', container);
        this.checkoutButton = ensureElement<HTMLButtonElement>('.basket__button', container);
    }

    set items(value: HTMLElement[]) {
        this.list.replaceChildren(...value);
        this.checkoutButton.disabled = value.length === 0;
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }

    set onCheckout(handler: () => void) {
        this.checkoutButton.addEventListener('click', handler);
    }
}