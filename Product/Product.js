const Category = require('../Category/Category');
const helpers = require('../Utils/helpers');
const MESSAGES = require('../Utils/messages');

class Product {
    constructor({ title, price, category }) {
        const { isValid, errorMessage } = this.checkValidForInit(price, category);

        if (!isValid) {
            throw new Error(errorMessage);
        }

        this.title = title;
        this.price = price;
        this.category = category;
    }

    checkValidForInit(price, category) {
        const validInfo = {
            isValid: true,
            errorMessage: '',
        };

        if (!(category instanceof Category)) {
            validInfo.isValid = false;
            validInfo.errorMessage = MESSAGES.INSTANCE_OF_ERROR('Category');
        } else if (!helpers.isGreaterThanZero(price)) {
            validInfo.isValid = false;
            validInfo.errorMessage = MESSAGES.PRICE_INVALID_ERROR;
        }

        return validInfo;
    }
}

module.exports = Product;
