import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class Form<T> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorElement: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.errorElement = ensureElement<HTMLElement>('.form__errors', container);

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.constructor.name.toLowerCase()}:submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.constructor.name.toLowerCase()}:change`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorElement.textContent = value;
    }

    render(data?: Partial<T> & { valid?: boolean; errors?: string }): HTMLElement {
        const { valid, errors, ...inputs } = data || {};
        if (valid !== undefined) this.valid = valid;
        if (errors !== undefined) this.errors = errors;
        Object.assign(this, inputs);
        return this.container;
    }
}