import { Component } from '../base/Component';

export class Gallery extends Component<{ items: HTMLElement[] }> {
    constructor(container: HTMLElement) {
        super(container);
    }

    set items(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}