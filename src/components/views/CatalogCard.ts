import { Card } from './Card';
import { ensureElement } from '../../utils/utils';
import { CDN_URL, categoryMap } from '../../utils/constants';

interface ICatalogCardData {
    id: string;
    title: string;
    image: string;
    category: string;
    price: number | null;
    onClick: () => void;
}

export class CatalogCard extends Card<ICatalogCardData> {
    protected _category?: HTMLElement;
    protected _image?: HTMLImageElement;

    constructor(container: HTMLElement, onClick: () => void) {
        super(container);
        
        this._category = container.querySelector('.card__category') || undefined;
        this._image = container.querySelector<HTMLImageElement>('.card__image') || undefined;
        
        container.addEventListener('click', onClick);
    }

    set category(value: string) {
        if (this._category) {
            this._category.textContent = value;
            const categoryClass = categoryMap[value as keyof typeof categoryMap];
            if (categoryClass) {
                this._category.className = 'card__category ' + categoryClass;
            }
        }
    }

    set image(value: string) {
        if (this._image) {
            this._image.src = `${CDN_URL}${value}`;
            this._image.alt = this.title;
        }
    }
}