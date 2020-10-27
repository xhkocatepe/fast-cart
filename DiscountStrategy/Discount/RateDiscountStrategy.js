
const IDiscountStrategy = require('../IDiscountStrategy');

class RateDiscountStrategy extends IDiscountStrategy {
    calculateDiscountPrice({ price, value: rate }) {
        return price * Math.abs(rate) / 100;
    }
}

module.exports = RateDiscountStrategy;
