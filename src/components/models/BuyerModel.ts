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
        this.emit('buyer:changed');
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
        this.emit('buyer:changed');
    }

    validate(): { isValid: boolean; errors: Partial<Record<keyof IBuyer, string>> } {
        const errors: Partial<Record<keyof IBuyer, string>> = {};
        
        if (!this.data.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }
        
        if (!this.data.address || this.data.address.trim() === '') {
            errors.address = 'Не указан адрес доставки';
        }
        
        if (!this.data.email || this.data.email.trim() === '') {
            errors.email = 'Не указан email';
        }
        
        if (!this.data.phone || this.data.phone.trim() === '') {
            errors.phone = 'Не указан телефон';
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}