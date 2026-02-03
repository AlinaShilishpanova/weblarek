import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface IHeaderData {
    counter: number;
}

export class Header extends Component<IHeaderData> {
    private _basketButton: HTMLButtonElement;
    private _counterElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this._basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
        this._counterElement = ensureElement<HTMLElement>('.header__basket-counter', container);
    }

    set counter(value: number) {
        this.setText(this._counterElement, String(value));
    }

    set basketButtonHandler(handler: () => void) {
        this._basketButton.addEventListener('click', handler);
    }
}