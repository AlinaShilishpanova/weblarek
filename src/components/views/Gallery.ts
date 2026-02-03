import { Component } from '../base/Component';

interface IGalleryData {
    items: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
    private _items: HTMLElement[] = [];

    set items(value: HTMLElement[]) {
        this._items = value;
        this.renderItems();
    }

    private renderItems() {
        this.container.innerHTML = '';
        this._items.forEach(item => {
            this.container.appendChild(item);
        });
    }

    render(data?: IGalleryData): HTMLElement {
        if (data?.items) {
            this.items = data.items;
        }
        return this.container;
    }
}