import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export abstract class Form<T> extends Component<T> {
    protected _submitButton: HTMLButtonElement;
    protected _errorElement: HTMLElement;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this._errorElement = ensureElement<HTMLElement>('.form__errors', container);

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.id}:submit`);
        });
    }

    set errors(messages: string[]) {
        this.setTextContent(this._errorElement, messages.join(', '));
        this._errorElement.classList.toggle('modal__message_error', messages.length > 0);
    }

    clearErrors() {
        this.setTextContent(this._errorElement, '');
        this._errorElement.classList.remove('modal__message_error');
    }

    private setTextContent(element: HTMLElement, text: string) {
        element.textContent = text;
    }
}