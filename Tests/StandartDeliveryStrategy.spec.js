const StandartDeliveryStrategy = require('../DeliveryStrategy/Delivery/StandartDeliveryStrategy');

describe('standartDeliveryStrategy.js side ->', () => {
    describe('when calculateDeliveryCost ->', () => {
        it('expects standart delivery cost', () => {
            const strategy = new StandartDeliveryStrategy();

            expect(strategy.calculateDeliveryCost(5)).toStrictEqual(19.99);
        });
    });
});
