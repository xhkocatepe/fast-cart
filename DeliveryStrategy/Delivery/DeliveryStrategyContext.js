class DeliveryStrategyContext {
    constructor(deliveryStrategy) {
        this.strategy = deliveryStrategy;
    }

    /**
     *  Executing delivery strategy depends on delivery algorithms.
     */
    executeDeliveryStrategy(numberOfProducts) {
        return this.strategy.calculateDeliveryCost(numberOfProducts);
    }
}

module.exports = DeliveryStrategyContext;
