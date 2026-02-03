import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface IBasketModalData {
    items: HTMLElement[];
    total: number;
    onCheckout: () => void;
}

export class BasketModal extends Component<IBasketModalData> {
    private _list: HTMLElement;
    private _total: HTMLElement;
    private _button: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);
    }

    set items(value: HTMLElement[]) {
        this._list.innerHTML = '';
        value.forEach(item => {
            this._list.appendChild(item);
        });
    }

    set total(value: number) {
        this.setText(this._total, `${value} синапсов`);
    }

    set buttonDisabled(value: boolean) {
        this._button.disabled = value;
    }

    set buttonHandler(handler: () => void) {
        this._button.addEventListener('click', handler);
    }

    render(data?: IBasketModalData): HTMLElement {
        if (data) {
            this.items = data.items;
            this.total = data.total;
            this.buttonDisabled = data.items.length === 0;
            this.buttonHandler = data.onCheckout;
        }
        return this.container;
    }
}