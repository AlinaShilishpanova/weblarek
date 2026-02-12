import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface ISuccessModalData {
    total: number;
    onClose: () => void;
}

export class SuccessModal extends Component<ISuccessModalData> {
    private closeButton: HTMLButtonElement;
    private descriptionElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this.closeButton = ensureElement<HTMLButtonElement>('.button', container);
        this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', container);
    }

    set total(value: number) {
        this.descriptionElement.textContent = `Списано ${value} синапсов`;
    }

    set onClose(handler: () => void) {
        this.closeButton.addEventListener('click', handler);
    }
}