const GoldDeliveryStrategy = require('../DeliveryStrategy/Delivery/GoldDeliveryStrategy');

describe('goldDeliveryStrategy.js side ->', () => {
    describe('when calculateDeliveryCost ->', () => {
        it('expects gold delivery cost', () => {
            const strategy = new GoldDeliveryStrategy();

            expect(strategy.calculateDeliveryCost(5)).toStrictEqual(6.99);
        });
    });
});
