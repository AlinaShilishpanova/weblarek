import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface IOrderFormData {
    payment: 'card' | 'cash' | null;
    address: string;
}

export class OrderForm extends Component<IOrderFormData> {
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;
    protected _addressInput: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;
    protected _errorElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this._errorElement = ensureElement<HTMLElement>('.form__errors', container);

        this._cardButton.addEventListener('click', () => this.selectPayment('card'));
        this._cashButton.addEventListener('click', () => this.selectPayment('cash'));
        this._addressInput.addEventListener('input', () => this.validateForm());
        
        this.container.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            if (!this._submitButton.disabled) {
                this.emitSubmit();
            }
        });
    }

    set payment(value: 'card' | 'cash' | null) {
        this._cardButton.classList.toggle('button_alt-active', value === 'card');
        this._cashButton.classList.toggle('button_alt-active', value === 'cash');
        this.validateForm();
    }

    set address(value: string) {
        this._addressInput.value = value;
        this.validateForm();
    }

    set errors(messages: string[]) {
        this.setText(this._errorElement, messages.join(', '));
        this._errorElement.classList.toggle('modal__message_error', messages.length > 0);
    }

    private selectPayment(payment: 'card' | 'cash') {
        this._cardButton.classList.toggle('button_alt-active', payment === 'card');
        this._cashButton.classList.toggle('button_alt-active', payment === 'cash');
        this.validateForm();
        
        this.container.dispatchEvent(new CustomEvent('payment:change', {
            detail: { payment }
        }));
    }

    clearErrors(): void {
        this.setText(this._errorElement, '');
        this._errorElement.classList.remove('modal__message_error');
    }

    private validateForm() {
        const paymentSelected = this._cardButton.classList.contains('button_alt-active') || 
                            this._cashButton.classList.contains('button_alt-active');
        const address = this._addressInput.value.trim();
        
        this._submitButton.disabled = !paymentSelected || address === '';
        
        if (paymentSelected && address !== '') {
            this.clearErrors();
        }
    }

    private emitSubmit() {
        const payment = this._cardButton.classList.contains('button_alt-active') ? 'card' : 
                       this._cashButton.classList.contains('button_alt-active') ? 'cash' : null;
        
        this.container.dispatchEvent(new CustomEvent('order:submit', {
            detail: {
                payment,
                address: this._addressInput.value
            }
        }));
    }

    render(data?: IOrderFormData): HTMLElement {
        if (data) {
            this.payment = data.payment;
            this.address = data.address;
        }
        return this.container;
    }
}