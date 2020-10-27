const { DELIVERY } = require('../../Utils/constants');
const IDeliverySystemStrategy = require('../IDeliveryCostStrategy');

class StandartDeliveryStrategy extends IDeliverySystemStrategy {
    calculateDeliveryCost(numberOfProducts) {
        const amount = DELIVERY.BASE_SHIPPING_AMOUNT.STANDART + (DELIVERY.PER_PIECE_AMOUNT.STANDART * numberOfProducts);

        return Number(Number(amount).toFixed(2));
    }
}

module.exports = StandartDeliveryStrategy;
