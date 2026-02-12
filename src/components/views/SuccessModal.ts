import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface ISuccessModalData {
    total: number;
}

export class SuccessModal extends Component<ISuccessModalData> {
    protected totalElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, onClose: () => void) {
        super(container);
        
        this.totalElement = ensureElement<HTMLElement>('.order-success__description', container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);
        
        this.closeButton.addEventListener('click', onClose);
    }

    set total(value: number) {
        this.totalElement.textContent = `Списано ${value} синапсов`;
    }
}