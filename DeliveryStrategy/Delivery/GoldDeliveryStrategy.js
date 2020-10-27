const { DELIVERY } = require('../../Utils/constants');
const IDeliverySystemStrategy = require('../IDeliveryCostStrategy');

class GoldDeliveryStrategy extends IDeliverySystemStrategy {
    calculateDeliveryCost(numberOfProducts) {
        const amount = DELIVERY.BASE_SHIPPING_AMOUNT.GOLD + (DELIVERY.PER_PIECE_AMOUNT.GOLD * numberOfProducts);

        return Number(Number(amount).toFixed(2));
    }
}

module.exports = GoldDeliveryStrategy;
