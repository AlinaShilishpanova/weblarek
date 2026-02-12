import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface IOrderFormData {
    payment: 'card' | 'cash' | null;
    address: string;
}

export class OrderForm extends Form<IOrderFormData> {
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;
    protected _addressInput: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        
        this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);

        this._cardButton.addEventListener('click', () => {
            this.events.emit('order:select-payment', { payment: 'card' });
        });

        this._cashButton.addEventListener('click', () => {
            this.events.emit('order:select-payment', { payment: 'cash' });
        });

        this._addressInput.addEventListener('input', () => {
            this.events.emit('order:change-address', { address: this._addressInput.value });
        });
    }

    set payment(value: 'card' | 'cash' | null) {
        this._cardButton.classList.toggle('button_alt-active', value === 'card');
        this._cashButton.classList.toggle('button_alt-active', value === 'cash');
    }

    set address(value: string) {
        this._addressInput.value = value;
    }

    set addressError(messages: string[]) {
        this.errors = messages;
    }

    render(data?: Partial<IOrderFormData>): HTMLElement {
        if (data) {
            if (data.payment !== undefined) this.payment = data.payment;
            if (data.address !== undefined) this.address = data.address;
        }
        return this.container;
    }
}