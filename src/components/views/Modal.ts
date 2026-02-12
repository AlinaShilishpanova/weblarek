import { Component } from '../base/Component'; 
import { ensureElement } from '../../utils/utils'; 
 
interface IModalData { 
    content: HTMLElement; 
} 
 
export class Modal extends Component<IModalData> { 
    private _closeButton: HTMLButtonElement; 
    private _content: HTMLElement; 
 
    constructor(container: HTMLElement) { 
        super(container); 
 
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container); 
        this._content = ensureElement<HTMLElement>('.modal__content', container); 
 
        this._closeButton.addEventListener('click', this.close.bind(this)); 
        container.addEventListener('click', (event) => { 
            if (event.target === container) { 
                this.close(); 
            } 
        }); 
    } 
 
    set content(value: HTMLElement) { 
        this._content.replaceChildren(value); 
    } 
 
    open() { 
        this.container.classList.add('modal_active'); 
    } 
 
    close() { 
        this.container.classList.remove('modal_active'); 
        this._content.innerHTML = ''; 
    } 
 
    render(data?: IModalData): HTMLElement { 
        if (data?.content) { 
            this.content = data.content; 
        } 
        return this.container; 
    } 
} 