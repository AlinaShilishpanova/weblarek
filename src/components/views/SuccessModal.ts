import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { formatNumber } from '../../utils/utils';

interface ISuccessModalData {
    total: number;
    onClose: () => void;
}

export class SuccessModal extends Component<ISuccessModalData> {
    private _description: HTMLElement;
    private _closeButton: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this._description = ensureElement<HTMLElement>('.order-success__description', container);
        this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);
    }

    set total(value: number) {
        this.setText(this._description, `Списано ${formatNumber(value)} синапсов`);
    }

    set closeHandler(handler: () => void) {
        this._closeButton.addEventListener('click', handler);
    }

    render(data?: ISuccessModalData): HTMLElement {
        if (data) {
            this.total = data.total;
            this.closeHandler = data.onClose;
        }
        return this.container;
    }
}