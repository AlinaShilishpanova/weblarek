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

    protected setPrice(value: number | null) {
        if (this._price) {
            this._price.textContent = value === null 
                ? 'Бесценно' 
                : `${formatNumber(value)} синапсов`;
        }
    }
}