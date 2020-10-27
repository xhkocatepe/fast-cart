const DeliveryStrategyContext = require('../DeliveryStrategy/Delivery/DeliveryStrategyContext');
const StandartDeliveryStrategy = require('../DeliveryStrategy/Delivery/StandartDeliveryStrategy');
const PremiumDeliveryStrategy = require('../DeliveryStrategy/Delivery/PremiumDeliveryStrategy');
const GoldDeliveryStrategy = require('../DeliveryStrategy/Delivery/GoldDeliveryStrategy');

const { DELIVERY } = require('../Utils/constants');

class Delivery {
    /**
     * Calculate Cost Operation with number of deliveries and products.
     */
    static calculateCost({ numberOfDeliveries, numberOfProducts }) {
        // score is calculated dynamically.
        const deliveryScore = this.calculateDeliveryScore({ numberOfDeliveries, numberOfProducts });

        // make decision which shipping strategy is applicable for cart according to delivery score.
        const deliveryStrategy = this.getDeliveryStrategy(deliveryScore);
        const deliveryContext = new DeliveryStrategyContext(deliveryStrategy);

        // calculate delivery price through context instance
        return deliveryContext.executeDeliveryStrategy(numberOfProducts);
    }

    /**
     *  Calculating score is dynamically.
     */
    static calculateDeliveryScore({ numberOfDeliveries, numberOfProducts }) {
        return numberOfDeliveries * DELIVERY.SCORE.PER_DELIVERY +
            numberOfProducts * DELIVERY.SCORE.PER_PRODUCT;
    }

    /**
     *  Get Delivery Strategy via score.
     */
    static getDeliveryStrategy(score) {
        let strategy;

        if (score <= DELIVERY.SCORE.BASE_LIMIT_GOLD) {
            strategy = new GoldDeliveryStrategy();
        } else if (score > DELIVERY.SCORE.BASE_LIMIT_GOLD && score <= DELIVERY.SCORE.BASE_LIMIT_PREMIUM) {
            strategy = new PremiumDeliveryStrategy();
        } else {
            strategy = new StandartDeliveryStrategy();
        }

        return strategy;
    }
}

module.exports = Delivery;
