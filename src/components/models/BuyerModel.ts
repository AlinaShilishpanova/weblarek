import { IBuyer } from '../../types';

export class BuyerModel {
    private _data: IBuyer = {
        payment: null,
        email: '',
        phone: '',
        address: ''
    };

    setData(data: Partial<IBuyer>): void {
        this._data = { ...this._data, ...data };
    }

    getData(): IBuyer {
        return { ...this._data };
    }

    clearData(): void {
        this._data = {
            payment: null,
            email: '',
            phone: '',
            address: ''
        };
    }

    validate(): Record<keyof IBuyer, string> | null {
        const errors: Partial<Record<keyof IBuyer, string>> = {};

        if (!this._data.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }
        if (!this._data.address?.trim()) {
            errors.address = 'Не указан адрес доставки';
        }
        if (!this._data.email?.trim()) {
            errors.email = 'Не указан email';
        }
        if (!this._data.phone?.trim()) {
            errors.phone = 'Не указан телефон';
        }

        return Object.keys(errors).length > 0 ? (errors as Record<keyof IBuyer, string>) : null;
    }
}