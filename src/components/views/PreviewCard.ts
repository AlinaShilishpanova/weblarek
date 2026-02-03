import { Card } from './Card';
import { IProduct } from '../../types';
import { CDN_URL } from '../../utils/constants';

interface IPreviewCardData extends IProduct {
    inBasket: boolean;
    onAddToBasket: (id: string) => void;
    onRemoveFromBasket: (id: string) => void;
}

export class PreviewCard extends Card<IPreviewCardData> {
    private _description: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        const desc = container.querySelector('.card__text');
        if (!desc) throw new Error('Элемент .card__text не найден');
        this._description = desc as HTMLElement;
    }

    render(data: IPreviewCardData): HTMLElement {
        super.render(data);
        
        this.setText(this._title, data.title);
        this.setText(this._description, data.description);
        this.setCategory(data.category);
        this.setCardImage(`${CDN_URL}${data.image}`, data.title);
        this.setPrice(data.price);

        if (data.price === null) {
            this.setButtonText('Недоступно');
            this.setButtonDisabled(true);
        } else if (data.inBasket) {
            this.setButtonText('Удалить из корзины');
            this.setButtonDisabled(false);
            this.setButtonHandler(() => data.onRemoveFromBasket(data.id));
        } else {
            this.setButtonText('В корзину');
            this.setButtonDisabled(false);
            this.setButtonHandler(() => data.onAddToBasket(data.id));
        }

        return this.container;
    }
}