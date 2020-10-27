const IDeliveryCostStrategy = require('../DeliveryStrategy/IDeliveryCostStrategy');


describe('iDeliveryStrategy.js side ->', () => {
    describe('reaching IDeliveryCostStrategy abstract methods ->', () => {
        it('calculateDeliveryCost method is', () => {
            const iDeliveryCostStrategyObject = IDeliveryCostStrategy.prototype;
            expect(typeof iDeliveryCostStrategyObject.calculateDeliveryCost).toStrictEqual('function');
            expect(iDeliveryCostStrategyObject.calculateDeliveryCost(5)).toBeUndefined();
        });
    });
});
