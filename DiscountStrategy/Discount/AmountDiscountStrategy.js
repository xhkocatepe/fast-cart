const IDiscountStrategy = require('../IDiscountStrategy');

class AmountDiscountStrategy extends IDiscountStrategy {
    calculateDiscountPrice({ price, value: amount }) {
        return (Math.abs(amount) > price ? price : Math.abs(amount));
    }
}

module.exports = AmountDiscountStrategy;
