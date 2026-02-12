import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { formatNumber } from '../../utils/utils';

export abstract class Card<T> extends Component<T> {
    protected _title: HTMLElement;
    protected _price?: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = container.querySelector('.card__price') || undefined;
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set price(value: number | null) {
        if (this._price) {
            if (value === null) {
                this._price.textContent = 'Бесценно';
            } else {
                this._price.textContent = `${formatNumber(value)} синапсов`;
            }
        }
    }
}