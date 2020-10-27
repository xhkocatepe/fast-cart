class DiscountStrategyContext {
    constructor(discountStrategy) {
        this.strategy = discountStrategy;
    }

    /**
     *  Executing discount strategy depends on discount algorithms.
     */
    executeDiscountStrategy({ price, value }) {
        return this.strategy.calculateDiscountPrice({ price, value });
    }
}

module.exports = DiscountStrategyContext;
