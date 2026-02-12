import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface IHeaderData {
    counter: number;
}

export class Header extends Component<IHeaderData> {
    private _basketButton: HTMLButtonElement;
    private _counterElement: HTMLElement;

    constructor(container: HTMLElement, private events: IEvents) {
        super(container);
        this._basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
        this._counterElement = ensureElement<HTMLElement>('.header__basket-counter', container);

        this._basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this._counterElement.textContent = String(value);
    }
}