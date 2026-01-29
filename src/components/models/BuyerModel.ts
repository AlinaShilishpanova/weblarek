import { IBuyer } from '../../types';

export type BuyerValidationErrors = Record<keyof IBuyer, string>;

export class BuyerModel {
    private data: IBuyer = {
        payment: null,
        email: '',
        phone: '',
        address: ''
    };

    setData(data: Partial<IBuyer>): void {
        this.data = { ...this.data, ...data };
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
    }

    validate(): BuyerValidationErrors {
        const errors: BuyerValidationErrors = {
            payment: '',
            email: '',
            phone: '',
            address: ''
        };

        if (!this.data.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }
        if (!this.data.address?.trim()) {
            errors.address = 'Не указан адрес доставки';
        }
        if (!this.data.email?.trim()) {
            errors.email = 'Не указан email';
        }
        if (!this.data.phone?.trim()) {
            errors.phone = 'Не указан телефон';
        }

        return errors;
    }
}