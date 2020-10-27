const Coupon = require('../Coupon/Coupon');
const AmountDiscountStrategy = require('../DiscountStrategy/Discount/AmountDiscountStrategy');
const RateDiscountStrategy = require('../DiscountStrategy/Discount/RateDiscountStrategy');

const { DISCOUNT_TYPE } = require('../Utils/constants');
const MESSAGES = require('../Utils/messages');

describe('coupon side ->', () => {
    describe('creating new Coupon ->', () => {
        it('when creating valid new Coupon, expect minPrice is entered number', () => {
            const coupon = new Coupon({ minPrice: 50, value: 10, type: DISCOUNT_TYPE.AMOUNT });

            expect(coupon.minPrice).toStrictEqual(50);
        });

        it('when creating valid new Coupon, expect value is entered number', () => {
            const coupon = new Coupon({ minPrice: 50, value: 10, type: DISCOUNT_TYPE.AMOUNT });

            expect(coupon.value).toStrictEqual(10);
        });

        it('when creating valid new Coupon, expect type is entered number', () => {
            const coupon = new Coupon({ minPrice: 50, value: 10, type: DISCOUNT_TYPE.RATE });

            expect(coupon.type).toStrictEqual(DISCOUNT_TYPE.RATE);
        });
    });
    describe('throwing validation errors ->', () => {
        it('when adding only invalid value bigger than 100 for type rate, expect throw rate limit error', () => {
            const type = DISCOUNT_TYPE.RATE;
            const value = 110;
            const couponCreate = () => new Coupon({ minPrice: 5, value, type });

            expect(() => couponCreate())
                .toThrow(new Error(MESSAGES.INVALID_RATE_LIMIT));
        });

        it('when adding invalid value less than 0 for type amount, expect throw invalid value error', () => {
            const type = DISCOUNT_TYPE.AMOUNT;
            const value = -5;
            const couponCreate = () => new Coupon({ minPrice: 5, value, type });

            expect(() => couponCreate())
                .toThrow(new Error(MESSAGES.INVALID_VALUE_AMOUNT));
        });

        it('when adding invalid value less than 0 for type rate, expect throw invalid rate limit error', () => {
            const type = DISCOUNT_TYPE.RATE;
            const value = -5;
            const couponCreate = () => new Coupon({ minPrice: 5, value, type });

            expect(() => couponCreate())
                .toThrow(new Error(MESSAGES.INVALID_RATE_LIMIT));
        });

        it('when adding only invalid quantity as negative number, expect throw minPrice invalid error', () => {
            const minPrice = -1;
            const couponCreate = () => new Coupon({ minPrice, value: 10, type: DISCOUNT_TYPE.RATE });


            expect(() => couponCreate())
                .toThrow(new Error(MESSAGES.COUPON_INVALID_MIN_AMOUNT));
        });

        it('when adding rate value and minPrice ' +
            'expect throw instance type error', () => {
            const minPrice = -1;
            const type = DISCOUNT_TYPE.RATE;
            const value = -5;
            const couponCreate = () => new Coupon({ minPrice, value, type });

            expect(() => couponCreate())
                .toThrow(new Error(MESSAGES.INVALID_RATE_LIMIT));
        });
    });

    describe('when apply type = rate to different prices, expects return discounted amount', () => {
        it('%20 of 500 = 100, min: 50', () => {
            const price = 500;
            const type = DISCOUNT_TYPE.RATE;
            const coupon = new Coupon({ minPrice: 50, value: 20, type });
            expect(coupon.apply(price)).toBe(100);
        });

        it('%25 of 0 = 0, min: 0', () => {
            const price = 0;
            const type = DISCOUNT_TYPE.RATE;
            const coupon = new Coupon({ minPrice: 0, value: 25, type });
            expect(coupon.apply(price)).toBe(0);
        });

        it('%25 of 0 = !!!, min: 50 -> expects throw error insufficient limit', () => {
            const price = 0;
            const type = DISCOUNT_TYPE.RATE;
            const coupon = new Coupon({ minPrice: 50, value: 25, type });
            expect(() => coupon.apply(price)).toThrow(new Error(MESSAGES.COUPON_INSUFFICIENT_LIMIT));
        });

        it('%50 of 100 = !!!, min: 150 -> expects throw insufficient limit error', () => {
            const price = 0;
            const type = DISCOUNT_TYPE.RATE;
            const coupon = new Coupon({ minPrice: 150, value: 25, type });
            expect(() => coupon.apply(price)).toThrow(new Error(MESSAGES.COUPON_INSUFFICIENT_LIMIT));
        });


        it('%13 of -50 = !!!, min: 20 -> expects throw price less than zero error!', () => {
            const price = -50;
            const type = DISCOUNT_TYPE.RATE;
            const coupon = new Coupon({ minPrice: 20, value: 25, type });
            expect(() => coupon.apply(price)).toThrow(new Error(MESSAGES.PRICE_NOT_LESS_THAN_ZERO));
        });

        it('-%20 of 50 = !!!, min: 30 -> expect throw rate limit error', () => {
            const value = -20;
            const type = DISCOUNT_TYPE.RATE;
            const couponCreate = () => new Coupon({ minPrice: 30, value, type });

            expect(() => couponCreate()).toThrow(new Error(MESSAGES.INVALID_RATE_LIMIT));
        });

        it('%110 of 50 = !!!, min: 45 -> expect throw rate limit error', () => {
            const value = 110;
            const type = DISCOUNT_TYPE.RATE;
            const couponCreate = () => new Coupon({ minPrice: 45, value, type });

            expect(() => couponCreate())
                .toThrow(new Error(MESSAGES.INVALID_RATE_LIMIT));
        });
    });
    describe('when apply type = amount to different prices, expects return discounted amount', () => {
        it('20 discount of 500 = 20, min: 300', () => {
            const price = 500;
            const type = DISCOUNT_TYPE.AMOUNT;
            const coupon = new Coupon({ minPrice: 300, value: 20, type });
            expect(coupon.apply(price)).toBe(20);
        });

        it('40 discount of 40 = 40, min: 40', () => {
            const price = 40;
            const type = DISCOUNT_TYPE.AMOUNT;
            const coupon = new Coupon({ minPrice: 40, value: 40, type });
            expect(coupon.apply(price)).toBe(40);
        });

        it('25 discount of 0 = 0, min: 0', () => {
            const price = 0;
            const type = DISCOUNT_TYPE.AMOUNT;
            const coupon = new Coupon({ minPrice: 0, value: 25, type });
            expect(coupon.apply(price)).toBe(price);
        });
        it('13 discount of -50, min: 30 -> expects throw price not be less than zero error!', () => {
            const price = -50;
            const type = DISCOUNT_TYPE.AMOUNT;
            const coupon = new Coupon({ minPrice: 30, value: 25, type });
            expect(() => coupon.apply(price)).toThrow(new Error(MESSAGES.PRICE_NOT_LESS_THAN_ZERO));
        });

        it('-20 discount of 50, min: 50 -> expects throw invalid value error!', () => {
            const value = -20;
            const type = DISCOUNT_TYPE.AMOUNT;
            const couponCreate = () => new Coupon({ minPrice: 50, value, type });

            expect(() => couponCreate())
                .toThrow(new Error(MESSAGES.INVALID_VALUE_AMOUNT));
        });

        it('110 discount of 50 = 50, min: 40', () => {
            const value = 110;
            const type = DISCOUNT_TYPE.AMOUNT;
            const price = 50;
            const coupon = new Coupon({ minPrice: 40, value, type });

            expect(coupon.apply(price)).toStrictEqual(price);
        });
    });
    describe('when apply discount through strategy ->', () => {
        it('when type equals rate, strategy must be rateDiscountStrategy', () => {
            const price = 500;
            const type = DISCOUNT_TYPE.RATE;
            const coupon = new Coupon({ minPrice: 50, value: 20, type });
            coupon.apply(price);

            expect(coupon.getDiscountStrategy() instanceof RateDiscountStrategy).toStrictEqual(true);
        });

        it('when type equals amount, strategy must be amountDiscountStrategy', () => {
            const price = 500;
            const type = DISCOUNT_TYPE.AMOUNT;
            const coupon = new Coupon({ minPrice: 40, value: 20, type });
            coupon.apply(price);

            expect(coupon.getDiscountStrategy() instanceof AmountDiscountStrategy).toStrictEqual(true);
        });

        it('when type not in amount or rate, strategy must be amountDiscountStrategy', () => {
            const price = 500;
            const type = 'nothing';
            const coupon = new Coupon({ minPrice: 55, value: 20, type });
            coupon.apply(price);

            expect(coupon.getDiscountStrategy() instanceof AmountDiscountStrategy).toStrictEqual(true);
        });
    });
});
