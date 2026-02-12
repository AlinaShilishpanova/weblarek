import { Component } from '../base/Component';

interface IGalleryData {
    items: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
    set items(value: HTMLElement[]) {
        this.container.replaceChildren(...value);
    }
}