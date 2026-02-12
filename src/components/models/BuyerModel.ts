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

    validatePaymentAndAddress(): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];
        if (!this.data.payment) errors.push('Не выбран способ оплаты');
        if (!this.data.address?.trim()) errors.push('Не указан адрес доставки');
        return { isValid: errors.length === 0, errors };
    }

    validateContacts(): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];
        if (!this.data.email?.trim()) errors.push('Не указан email');
        if (!this.data.phone?.trim()) errors.push('Не указан телефон');
        return { isValid: errors.length === 0, errors };
    }

    isValid(): boolean {
        return this.validatePaymentAndAddress().isValid && 
               this.validateContacts().isValid;
    }
}