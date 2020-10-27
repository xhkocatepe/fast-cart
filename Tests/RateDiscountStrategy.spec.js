const RateDiscountStrategy = require('../DiscountStrategy/Discount/RateDiscountStrategy');

describe('rateDiscountStrategy.js side ->', () => {
    describe('when calculateDiscountPrice, expects rate discount amount ->', () => {
        it('(20 of 200 = 40)', () => {
            const strategy = new RateDiscountStrategy();

            expect(strategy.calculateDiscountPrice({ value: 20, price: 200 })).toStrictEqual(40);
        });

        it('(0 of 200 = 0)', () => {
            const strategy = new RateDiscountStrategy();

            expect(strategy.calculateDiscountPrice({ value: 0, price: 200 })).toStrictEqual(0);
        });
    });
});
