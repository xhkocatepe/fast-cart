const IDiscountStrategy = require('../DiscountStrategy/IDiscountStrategy');


describe('iDiscountStrategy.js side ->', () => {
    describe('reaching IDiscountStrategy abstract methods ->', () => {
        it('calculateDiscountPrice method is', () => {
            const iDiscountStrategyObject = IDiscountStrategy.prototype;
            expect(typeof iDiscountStrategyObject.calculateDiscountPrice).toStrictEqual('function');
            expect(iDiscountStrategyObject.calculateDiscountPrice({ price: 10, value: 10 })).toBeUndefined();
        });
    });
});
