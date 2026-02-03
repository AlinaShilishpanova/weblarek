import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { formatNumber } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

export abstract class Card<T> extends Component<T> {
    protected _category?: HTMLElement;
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _price?: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._category = container.querySelector('.card__category') || undefined;
        this._image = container.querySelector<HTMLImageElement>('.card__image') || undefined;
        this._price = container.querySelector('.card__price') || undefined;
        this._button = container.querySelector<HTMLButtonElement>('.button') || undefined;
    }

    protected setCategory(category: string) {
        if (this._category) {
            this.setText(this._category, category);
            const categoryClass = categoryMap[category as keyof typeof categoryMap];
            if (categoryClass) {
                this._category.className = 'card__category ' + categoryClass;
            }
        }
    }

    protected setCardImage(src: string, alt?: string) {
        if (this._image) {
            this.setImage(this._image, src, alt);
        }
    }

    protected setPrice(value: number | null) {
        if (this._price) {
            if (value === null) {
                this.setText(this._price, 'Бесценно');
            } else {
                this.setText(this._price, `${formatNumber(value)} синапсов`);
            }
        }
    }

    protected setButtonText(text: string) {
        if (this._button) {
            this.setText(this._button, text);
        }
    }

    protected setButtonDisabled(disabled: boolean) {
        if (this._button) {
            this._button.disabled = disabled;
        }
    }

    protected setButtonHandler(handler: () => void) {
        if (this._button) {
            this._button.addEventListener('click', handler);
        }
    }
}