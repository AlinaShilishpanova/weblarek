import { Card } from './Card';
import { IProduct } from '../../types';
import { CDN_URL, categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

interface ICatalogCardData extends IProduct {
    onClick: (id: string) => void;
}

export class CatalogCard extends Card<ICatalogCardData> {
    private _category: HTMLElement;
    private _image: HTMLImageElement;

    constructor(container: HTMLElement, private readonly onClick?: (id: string) => void) {
        super(container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);

        if (onClick) {
            container.addEventListener('click', () => {
                onClick(this.id);
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

    render(data: ICatalogCardData): HTMLElement {
        this.id = data.id;
        this.title = data.title;
        this.category = data.category;
        this.image = data.image;
        this.price = data.price;
        return this.container;
    }
}