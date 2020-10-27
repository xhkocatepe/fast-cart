const PremiumDeliveryStrategy = require('../DeliveryStrategy/Delivery/PremiumDeliveryStrategy');

describe('premiumDeliveryStrategy.js side ->', () => {
    describe('when calculateDeliveryCost ->', () => {
        it('expects premium delivery cost', () => {
            const strategy = new PremiumDeliveryStrategy();

            expect(strategy.calculateDeliveryCost(5)).toStrictEqual(12.99);
        });
    });
});
