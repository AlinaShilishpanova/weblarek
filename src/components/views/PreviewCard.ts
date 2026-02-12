import { Card } from './Card';
import { IProduct } from '../../types';
import { CDN_URL, categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

interface IPreviewCardData extends IProduct {
    inBasket: boolean;
    buttonText: string;
    buttonDisabled: boolean;
}

export class PreviewCard extends Card<IPreviewCardData> {
    private _category: HTMLElement;
    private _image: HTMLImageElement;
    private _description: HTMLElement;
    private _button: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        private readonly onButtonClick?: (id: string) => void
    ) {
        super(container);
        
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.button', container);

        if (onButtonClick) {
            this._button.addEventListener('click', () => {
                onButtonClick(this.id);
            });
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this._title.textContent = value;
        this._image.alt = value;
    }

    set description(value: string) {
        this._description.textContent = value;
    }

    set category(value: string) {
        this._category.textContent = value;
        const categoryClass = categoryMap[value as keyof typeof categoryMap];
        if (categoryClass) {
            this._category.className = `card__category ${categoryClass}`;
        }
    }

    set image(value: string) {
        this.setImage(this._image, `${CDN_URL}${value}`, this._title.textContent || '');
    }

    set price(value: number | null) {
        this.setPrice(value);
    }

    set buttonText(value: string) {
        this._button.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this._button.disabled = value;
    }

    render(data: IPreviewCardData): HTMLElement {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.category = data.category;
        this.image = data.image;
        this.price = data.price;
        this.buttonText = data.buttonText;
        this.buttonDisabled = data.buttonDisabled;
        return this.container;
    }
}