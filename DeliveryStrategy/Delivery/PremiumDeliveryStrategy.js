const { DELIVERY } = require('../../Utils/constants');
const IDeliverySystemStrategy = require('../IDeliveryCostStrategy');

class PremiumDeliveryStrategy extends IDeliverySystemStrategy {
    calculateDeliveryCost(numberOfProducts) {
        const amount = DELIVERY.BASE_SHIPPING_AMOUNT.PREMIUM + (DELIVERY.PER_PIECE_AMOUNT.PREMIUM * numberOfProducts);

        return Number(Number(amount).toFixed(2));
    }
}

module.exports = PremiumDeliveryStrategy;
