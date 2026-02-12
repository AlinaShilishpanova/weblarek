import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface IBasketModalData {
    items: HTMLElement[];
    total: number;
}

export class BasketModal extends Component<IBasketModalData> {
    protected listElement: HTMLElement;
    protected totalElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, onCheckout: () => void) {
        super(container);
        
        this.listElement = ensureElement<HTMLElement>('.basket__list', container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', container);
        
        this.buttonElement.addEventListener('click', onCheckout);
    }

    set items(value: HTMLElement[]) {
        this.listElement.replaceChildren(...value);
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }

    set buttonDisabled(value: boolean) {
        this.buttonElement.disabled = value;
    }
}