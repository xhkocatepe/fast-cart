const DiscountStrategyContext = require('../DiscountStrategy/Discount/DiscountStrategyContext');
const RateDiscountStrategy = require('../DiscountStrategy/Discount/RateDiscountStrategy');
const AmountDiscountStrategy = require('../DiscountStrategy/Discount/AmountDiscountStrategy');


describe('discountStrategyContext.js side ->', () => {
    describe('when creating new DiscountStrategyContext ->', () => {
        it('strategy equals rateDiscountStrategy', () => {
            const strategy = new RateDiscountStrategy();
            const discountStrategyContext = new DiscountStrategyContext(strategy);

            expect(discountStrategyContext.strategy).toStrictEqual(strategy);
        });

        it('strategy equals premiumDiscountStrategy', () => {
            const strategy = new AmountDiscountStrategy();
            const discountStrategyContext = new DiscountStrategyContext(strategy);

            expect(discountStrategyContext.strategy).toStrictEqual(strategy);
        });
    });
    describe('when executing discount strategy ->', () => {
        it('execute rateDiscountStrategy expects rate discount amount (20 of 200 = 40)', () => {
            const strategy = new RateDiscountStrategy();
            const discountStrategyContext = new DiscountStrategyContext(strategy);
            const price = 200;
            const rate = 20;

            expect(discountStrategyContext.executeDiscountStrategy({ price, value: rate })).toStrictEqual(40);
        });

        it('execute amountDiscountStrategy expects amount discount amount (20 of 200 = 20)', () => {
            const strategy = new AmountDiscountStrategy();
            const discountStrategyContext = new DiscountStrategyContext(strategy);
            const price = 200;
            const amount = 20;

            expect(discountStrategyContext.executeDiscountStrategy({ price, value: amount })).toStrictEqual(20);
        });
    });
});
