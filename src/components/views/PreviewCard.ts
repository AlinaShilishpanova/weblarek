import { Card } from './Card';
import { ensureElement } from '../../utils/utils';
import { CDN_URL, categoryMap } from '../../utils/constants';

interface IPreviewCardData {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number | null;
    buttonText: string;
    buttonDisabled: boolean;
    onButtonClick: () => void;
}

export class PreviewCard extends Card<IPreviewCardData> {
    protected descriptionElement: HTMLElement;
    protected categoryElement?: HTMLElement;
    protected imageElement?: HTMLImageElement;
    protected buttonElement?: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
        this.categoryElement = container.querySelector('.card__category') || undefined;
        this.imageElement = container.querySelector<HTMLImageElement>('.card__image') || undefined;
        this.buttonElement = container.querySelector<HTMLButtonElement>('.button') || undefined;
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set category(value: string) {
        if (this.categoryElement) {
            this.categoryElement.textContent = value;
            const categoryClass = categoryMap[value as keyof typeof categoryMap];
            if (categoryClass) {
                this.categoryElement.className = 'card__category ' + categoryClass;
            }
        }
    }

    set image(value: string) {
        if (this.imageElement) {
            this.imageElement.src = `${CDN_URL}${value}`;
            this.imageElement.alt = this.title;
        }
    }

    set buttonText(value: string) {
        if (this.buttonElement) {
            this.buttonElement.textContent = value;
        }
    }

    set buttonDisabled(value: boolean) {
        if (this.buttonElement) {
            this.buttonElement.disabled = value;
        }
    }

    set onButtonClick(handler: () => void) {
        if (this.buttonElement) {
            this.buttonElement.addEventListener('click', handler);
        }
    }
}