import { IBuyer } from '../../types';
import { EventEmitter } from '../base/Events';

export class BuyerModel extends EventEmitter {
    private data: IBuyer = {
        payment: null,
        email: '',
        phone: '',
        address: ''
    };

    setData(data: Partial<IBuyer>): void {
        this.data = { ...this.data, ...data };
        this.emit('buyer:changed', { data: this.data });
    }

    getData(): IBuyer {
        return { ...this.data };
    }

    clearData(): void {
        this.data = {
            payment: null,
            email: '',
            phone: '',
            address: ''
        };
        this.emit('buyer:changed', { data: this.data });
    }

    isValid(): boolean {
        const data = this.data;
        return !!data.payment && 
               data.address.trim() !== '' && 
               data.email.trim() !== '' && 
               data.phone.trim() !== '';
    }
}