const DiscountStrategyContext = require('../DiscountStrategy/Discount/DiscountStrategyContext');
const AmountDiscountStrategy = require('../DiscountStrategy/Discount/AmountDiscountStrategy');
const RateDiscountStrategy = require('../DiscountStrategy/Discount/RateDiscountStrategy');

const CONSTANTS = require('../Utils/constants');
const MESSAGES = require('../Utils/messages');
const helpers = require('../Utils/helpers');

class Coupon {
    constructor({ minPrice, value, type }) {
        const { isValid, errorMessage } = this.checkValidForInit({ minPrice, value, type });

        if (!isValid) {
            throw new Error(errorMessage);
        }

        this.minPrice = minPrice;
        this.value = value;
        this.type = type;
    }

    checkValidForInit({ minPrice, value, type }) {
        let isValid = true;
        let errorMessage = '';

        if (type === CONSTANTS.DISCOUNT_TYPE.RATE &&
            !(value <= CONSTANTS.MAX_RATE && value >= CONSTANTS.MIN_RATE)) {
            isValid = false;
            errorMessage = MESSAGES.INVALID_RATE_LIMIT;
        } else if (!(helpers.isGreaterThanEqualZero(value))) {
            isValid = false;
            errorMessage = MESSAGES.INVALID_VALUE_AMOUNT;
        } else if (!(helpers.isGreaterThanEqualZero(minPrice))) {
            isValid = false;
            errorMessage = MESSAGES.COUPON_INVALID_MIN_AMOUNT;
        }

        return { isValid, errorMessage };
    }

    /**
     * Apply Coupon to Cart.
     */
    apply(price) {
        if (helpers.isLessThanZero(price)) {
            throw new Error(MESSAGES.PRICE_NOT_LESS_THAN_ZERO);
        }

        if (price < this.minPrice) {
            throw new Error(MESSAGES.COUPON_INSUFFICIENT_LIMIT);
        }

        // make decision which discount strategy is applicable for cart according to discount type.
        const discountStrategy = this.getDiscountStrategy();
        const discountContext = new DiscountStrategyContext(discountStrategy);

        return discountContext.executeDiscountStrategy({ price, value: this.value });
    }

    /**
     * Calculate Discount Strategy via Discount Type
     */
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

module.exports = Coupon;
