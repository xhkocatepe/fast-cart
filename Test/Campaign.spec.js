const Category = require('../Category/Category');
const Campaign = require('../Campaign/Campaign');
const AmountDiscountStrategy = require('../DiscountStrategy/Discount/AmountDiscountStrategy');
const RateDiscountStrategy = require('../DiscountStrategy/Discount/RateDiscountStrategy');

const { DISCOUNT_TYPE } = require('../Utils/constants');
const MESSAGES = require('../Utils/messages');

const category = new Category('Food');

describe('campaign side ->', () => {
    describe('creating new Campaign ->', () => {
        it('when creating valid new Campaign, expect minQuantity is entered number', () => {
            const campaign = new Campaign({ category, minQuantity: 5, value: 10, type: DISCOUNT_TYPE.RATE });

            expect(campaign.minQuantity).toStrictEqual(5);
        });

        it('when creating valid new Campaign, expect type is entered number', () => {
            const campaign = new Campaign({ category, minQuantity: 5, value: 10, type: DISCOUNT_TYPE.AMOUNT });

            expect(campaign.type).toStrictEqual(DISCOUNT_TYPE.AMOUNT);
        });

        it('when creating valid new Campaign, expect category is entered category', () => {
            const campaign = new Campaign({ category, minQuantity: 5, value: 10, type: DISCOUNT_TYPE.AMOUNT });

            expect(campaign.category).toStrictEqual(category);
        });

        it('when creating valid new Campaign, expect value is entered number', () => {
            const campaign = new Campaign({ category, minQuantity: 5, value: 10, type: DISCOUNT_TYPE.RATE });

            expect(campaign.value).toStrictEqual(10);
        });
    });
    describe('throwing validation errors ->', () => {
        it('when adding only invalid category, expect throw instance type error', () => {
            const InvalidCategory = 'category';
            const campaignCreate = () => new Campaign(
                { category: InvalidCategory, minQuantity: 5, value: 10, type: DISCOUNT_TYPE.RATE }
            );

            expect(() => campaignCreate())
                .toThrow(new Error(MESSAGES.INSTANCE_OF_ERROR('Category')));
        });

        it('when adding only invalid value bigger than 100 for type rate, expect throw rate limit error', () => {
            const type = DISCOUNT_TYPE.RATE;
            const value = 110;
            const campaignCreate = () => new Campaign(
                { category, minQuantity: 5, value, type }
            );

            expect(() => campaignCreate())
                .toThrow(new Error(MESSAGES.INVALID_RATE_LIMIT));
        });

        it('when adding invalid value less than 0 for type amount , expect throw invalid value error', () => {
            const type = DISCOUNT_TYPE.AMOUNT;
            const value = -5;
            const campaignCreate = () => new Campaign(
                { category, minQuantity: 5, value, type }
            );

            expect(() => campaignCreate())
                .toThrow(new Error(MESSAGES.INVALID_VALUE_AMOUNT));
        });

        it('when adding invalid value less than 0 for type rate , expect throw invalid rate limit error', () => {
            const type = DISCOUNT_TYPE.RATE;
            const value = -5;
            const campaignCreate = () => new Campaign(
                { category, minQuantity: 5, value, type }
            );

            expect(() => campaignCreate())
                .toThrow(new Error(MESSAGES.INVALID_RATE_LIMIT));
        });

        it('when adding only invalid quantity as negative number, expect throw quantity invalid error', () => {
            const minQuantity = -1;
            const campaignCreate = () => new Campaign(
                { category, minQuantity, value: 50, type: DISCOUNT_TYPE.RATE }
            );

            expect(() => campaignCreate())
                .toThrow(new Error(MESSAGES.INVALID_QUANTITY));
        });

        it('when adding invalid category, rate value and minQuantity, ' +
            'expect throw instance type error', () => {
            const minQuantity = -1;
            const type = DISCOUNT_TYPE.RATE;
            const value = -5;
            const invalidCategory = 'category';
            const campaignCreate = () => new Campaign(
                { category: invalidCategory, minQuantity, value, type }
            );

            expect(() => campaignCreate())
                .toThrow(new Error(
                    MESSAGES.INSTANCE_OF_ERROR('Category')
                ));
        });
    });

    describe('when apply rate to different prices, expects return discounted amount', () => {
        it('%20 of 500 = 100', () => {
            const price = 500;
            const type = DISCOUNT_TYPE.RATE;
            const campaign = new Campaign({ category, minQuantity: 5, value: 20, type });
            expect(campaign.apply(price)).toBe(100);
        });

        it('%25 of 0 = 0', () => {
            const price = 0;
            const type = DISCOUNT_TYPE.RATE;
            const campaign = new Campaign({ category, minQuantity: 5, value: 25, type });
            expect(campaign.apply(price)).toBe(0);
        });

        it('%13 of -50 -> expects throw error!', () => {
            const price = -50;
            const type = DISCOUNT_TYPE.RATE;
            const campaign = new Campaign({ category, minQuantity: 5, value: 25, type });
            expect(() => campaign.apply(price)).toThrow(new Error(MESSAGES.PRICE_NOT_LESS_THAN_ZERO));
        });

        it('-%20 of 50, expect throw rate limit error', () => {
            const value = -20;
            const type = DISCOUNT_TYPE.RATE;
            const campaignCreate = () => new Campaign(
                { category, minQuantity: 5, value, type }
            );

            expect(() => campaignCreate()).toThrow(new Error(MESSAGES.INVALID_RATE_LIMIT));
        });

        it('%110 of 50, expect throw rate limit error', () => {
            const value = 110;
            const type = DISCOUNT_TYPE.RATE;
            const campaignCreate = () => new Campaign(
                { category, minQuantity: 5, value, type }
            );

            expect(() => campaignCreate())
                .toThrow(new Error(MESSAGES.INVALID_RATE_LIMIT));
        });
    });
    describe('when apply amount to different prices, expects return discounted amount', () => {
        it('20 discount of 500 = 20', () => {
            const price = 500;
            const type = DISCOUNT_TYPE.AMOUNT;
            const campaign = new Campaign({ category, minQuantity: 5, value: 20, type });
            expect(campaign.apply(price)).toBe(20);
        });
        it('25 discount of 0 = 0', () => {
            const price = 0;
            const type = DISCOUNT_TYPE.AMOUNT;
            const campaign = new Campaign({ category, minQuantity: 5, value: 25, type });
            expect(campaign.apply(price)).toBe(0);
        });
        it('13 discount of -50 -> expects throw error!', () => {
            const price = -50;
            const type = DISCOUNT_TYPE.AMOUNT;
            const campaign = new Campaign({ category, minQuantity: 5, value: 25, type });
            expect(() => campaign.apply(price)).toThrow(new Error(MESSAGES.PRICE_NOT_LESS_THAN_ZERO));
        });

        it('-20 discount of 50, expects throw Error!', () => {
            const value = -20;
            const type = DISCOUNT_TYPE.AMOUNT;
            const campaignCreate = () => new Campaign(
                { category, minQuantity: 5, value, type }
            );

            expect(() => campaignCreate())
                .toThrow(new Error(MESSAGES.INVALID_VALUE_AMOUNT));
        });

        it('110 of 50 = 50', () => {
            const value = 110;
            const type = DISCOUNT_TYPE.AMOUNT;
            const price = 50;
            const campaign = new Campaign({ category, minQuantity: 5, value, type });

            expect(campaign.apply(price)).toStrictEqual(price);
        });
    });
    describe('when apply discount through strategy ->', () => {
        it('when type equals rate, strategy must be rateDiscountStrategy', () => {
            const price = 500;
            const type = DISCOUNT_TYPE.RATE;
            const campaign = new Campaign({ category, minQuantity: 5, value: 20, type });
            campaign.apply(price);

            expect(campaign.getDiscountStrategy() instanceof RateDiscountStrategy).toStrictEqual(true);
        });

        it('when type equals amount, strategy must be amountDiscountStrategy', () => {
            const price = 500;
            const type = DISCOUNT_TYPE.AMOUNT;
            const campaign = new Campaign({ category, minQuantity: 5, value: 20, type });
            campaign.apply(price);

            expect(campaign.getDiscountStrategy() instanceof AmountDiscountStrategy).toStrictEqual(true);
        });

        it('when type not in amount or rate, strategy must be amountDiscountStrategy', () => {
            const price = 500;
            const type = 'nothing';
            const campaign = new Campaign({ category, minQuantity: 5, value: 20, type });
            campaign.apply(price);

            expect(campaign.getDiscountStrategy() instanceof AmountDiscountStrategy).toStrictEqual(true);
        });
    });
});
