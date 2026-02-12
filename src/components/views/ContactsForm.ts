import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface IContactsFormData {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        
        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);

        this._emailInput.addEventListener('input', () => {
            this.events.emit('contacts:change-email', { email: this._emailInput.value });
        });

        this._phoneInput.addEventListener('input', () => {
            this.events.emit('contacts:change-phone', { phone: this._phoneInput.value });
        });
    }

    set email(value: string) {
        this._emailInput.value = value;
    }

    set phone(value: string) {
        this._phoneInput.value = value;
    }

    set contactsError(messages: string[]) {
        this.errors = messages;
    }

    render(data?: Partial<IContactsFormData>): HTMLElement {
        if (data) {
            if (data.email !== undefined) this.email = data.email;
            if (data.phone !== undefined) this.phone = data.phone;
        }
        return this.container;
    }
}