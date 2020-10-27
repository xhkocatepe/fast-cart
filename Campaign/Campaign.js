const DiscountStrategyContext = require('../DiscountStrategy/Discount/DiscountStrategyContext');
const AmountDiscountStrategy = require('../DiscountStrategy/Discount/AmountDiscountStrategy');
const RateDiscountStrategy = require('../DiscountStrategy/Discount/RateDiscountStrategy');

const MESSAGES = require('../Utils/messages');
const CONSTANTS = require('../Utils/constants');
const helpers = require('../Utils/helpers');

class Campaign {
    constructor({ category, minQuantity, value, type }) {
        const { isValid, errorMessage } = this.checkValidForInit({ category, minQuantity, value, type });

        if (!isValid) {
            throw new Error(errorMessage);
        }

        this.minQuantity = minQuantity;
        this.type = type;
        this.value = value;
        this.category = category;
        category.addCampaign(this); // it is necessary to be found applicableCampaigns for items
    }

    checkValidForInit({ category, minQuantity, value, type }) {
        let isValid = true;
        let errorMessage = '';

        // we call 'required' this line because of getting rid of cycle dependency.
        const Category = require('../Category/Category');
        if (!(category instanceof Category)) {
            isValid = false;
            errorMessage = MESSAGES.INSTANCE_OF_ERROR('Category');
        } else if ((type === CONSTANTS.DISCOUNT_TYPE.RATE &&
            !(value <= CONSTANTS.MAX_RATE && value >= CONSTANTS.MIN_RATE))) {
            isValid = false;
            errorMessage = MESSAGES.INVALID_RATE_LIMIT;
        } else if (!(helpers.isGreaterThanEqualZero(value))) {
            isValid = false;
            errorMessage = MESSAGES.INVALID_VALUE_AMOUNT;
        } else if (!(helpers.isInteger(minQuantity) && helpers.isGreaterThanZero(minQuantity))) {
            isValid = false;
            errorMessage = MESSAGES.INVALID_QUANTITY;
        }

        return { isValid, errorMessage };
    }

    apply(price) {
        if (helpers.isLessThanZero(price)) {
            throw new Error(MESSAGES.PRICE_NOT_LESS_THAN_ZERO);
        }

        // make decision which discount strategy is applicable for cart according to discount type.
        const discountStrategy = this.getDiscountStrategy();
        const discountContext = new DiscountStrategyContext(discountStrategy);

        // calculate coupon discount
        // Ex: Price:200 TL, Coupon: % 25, return value: 50TL
        return discountContext.executeDiscountStrategy({ price, value: this.value });
    }

    getDiscountStrategy() {
        let strategy;

        switch (this.type) {
        case CONSTANTS.DISCOUNT_TYPE.RATE:
            strategy = new RateDiscountStrategy();
            break;
        case CONSTANTS.DISCOUNT_TYPE.AMOUNT:
            strategy = new AmountDiscountStrategy();
            break;
        default:
            strategy = new AmountDiscountStrategy();
            break;
        }

        return strategy;
    }
}

module.exports = Campaign;
