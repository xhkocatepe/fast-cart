const AmountDiscountStrategy = require('../DiscountStrategy/Discount/AmountDiscountStrategy');

describe('amountDiscountStrategy.js side ->', () => {
    describe('when calculateDiscountPrice, expects amount discount amount ->', () => {
        it('(20 of 200 = 20)', () => {
            const strategy = new AmountDiscountStrategy();

            expect(strategy.calculateDiscountPrice({ value: 20, price: 200 })).toStrictEqual(20);
        });

        it('(0 of 200 = 0)', () => {
            const strategy = new AmountDiscountStrategy();

            expect(strategy.calculateDiscountPrice({ value: 0, price: 200 })).toStrictEqual(0);
        });

        it('(150 of 50 = 50)', () => {
            const strategy = new AmountDiscountStrategy();

            expect(strategy.calculateDiscountPrice({ value: 150, price: 50 })).toStrictEqual(50);
        });
    });
});
