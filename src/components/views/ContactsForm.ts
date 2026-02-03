import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface IContactsFormData {
    email: string;
    phone: string;
}

export class ContactsForm extends Component<IContactsFormData> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;
    protected _errorElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this._errorElement = ensureElement<HTMLElement>('.form__errors', container);

        this._emailInput.addEventListener('input', () => this.validateForm());
        this._phoneInput.addEventListener('input', () => this.validateForm());
        
        this.container.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            if (!this._submitButton.disabled) {
                this.emitSubmit();
            }
        });
    }

    set email(value: string) {
        this._emailInput.value = value;
        this.validateForm();
    }

    set phone(value: string) {
        this._phoneInput.value = value;
        this.validateForm();
    }

    set errors(messages: string[]) {
        this.setText(this._errorElement, messages.join(', '));
        this._errorElement.classList.toggle('modal__message_error', messages.length > 0);
    }

    clearErrors(): void {
        this.setText(this._errorElement, '');
        this._errorElement.classList.remove('modal__message_error');
    }

    private validateForm() {
        const email = this._emailInput.value.trim();
        const phone = this._phoneInput.value.trim();
        
        this._submitButton.disabled = email === '' || phone === '';
        
        if (email !== '' && phone !== '') {
            this.clearErrors();
        }
    }

    private emitSubmit() {
        this.container.dispatchEvent(new CustomEvent('contacts:submit', {
            detail: {
                email: this._emailInput.value,
                phone: this._phoneInput.value
            }
        }));
    }

    render(data?: IContactsFormData): HTMLElement {
        if (data) {
            this.email = data.email;
            this.phone = data.phone;
        }
        return this.container;
    }
}