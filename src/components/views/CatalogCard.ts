import { Card } from './Card';
import { IProduct } from '../../types';
import { CDN_URL } from '../../utils/constants';

interface ICatalogCardData extends IProduct {
    onClick: (id: string) => void;
}

export class CatalogCard extends Card<ICatalogCardData> {
    private _clickHandler?: () => void;

    constructor(container: HTMLElement) {
        super(container);
    }

    render(data: ICatalogCardData): HTMLElement {
        super.render(data);
        
        this.setText(this._title, data.title);
        this.setCategory(data.category);
        this.setCardImage(`${CDN_URL}${data.image}`, data.title);
        this.setPrice(data.price);
        
        if (this._clickHandler) {
            this.container.removeEventListener('click', this._clickHandler);
        }
        
        this._clickHandler = () => {
            console.log('Card clicked:', data.id);
            data.onClick(data.id);
        };
        
        this.container.addEventListener('click', this._clickHandler);

        return this.container;
    }
}