const MESSAGES = require('../Utils/messages');
const CONSTANTS = require('../Utils/constants');

const Category = require('../Category/Category');
const Campaign = require('../Campaign/Campaign');


describe('category side ->', () => {
    describe('creating new Category ->', () => {
        it('when creating valid new Category, expect title is entered string', () => {
            const category = new Category('Food');
            expect(category.title).toStrictEqual('Food');
        });
        it('when creating valid new Category, expect has empty array campaigns', () => {
            const category = new Category('Car');
            expect(category.campaigns).toHaveLength(0);
        });
        it('when there is no parent category, expect hasParent to be false', () => {
            const category = new Category('Food');
            expect(category.hasParent).toStrictEqual(false);
        });
        it('when adding valid parent category, expect hasParent to be true', () => {
            const parentCategory = new Category('Car');
            const category = new Category('Volkswagen', parentCategory);
            expect(category.hasParent).toStrictEqual(true);
        });
        it('when adding valid parent category, expect parentCategory instance of Category', () => {
            const parentCategory = new Category('Car');
            const category = new Category('Volkswagen', parentCategory);

            expect(category.parentCategory instanceof Category).toStrictEqual(true);
        });
        it('when adding valid parent category, expect parentCategory title must be equal self', () => {
            const parentCategory = new Category('Car');
            const category = new Category('Volkswagen', parentCategory);
            expect(category.parentCategory.title).toStrictEqual('Car');
        });
        it('when adding invalid parent category, expect throw instance type Error', () => {
            const parentCategory = 'category';
            expect(() => new Category('Volkswagen', parentCategory))
                .toThrow(new Error(MESSAGES.INSTANCE_OF_ERROR('Category')));
        });
    });
    describe('adding new Campaign to Category ->', () => {
        it('when adding new Campaign, expect campaign is instanceof Campaign', () => {
            const category = new Category('Food');
            const campaign = new Campaign(
                { category, minQuantity: 5, value: 50, type: CONSTANTS.DISCOUNT_TYPE.RATE }
            );
            const categoryCampaign = category.campaigns.find((_campaign) => _campaign === campaign);

            expect(categoryCampaign instanceof Campaign).toStrictEqual(true);
        });
        it('when adding wrong Campaign, expect throw instance type Error', () => {
            const category = new Category('Food');
            const campaign = 'campaign';

            expect(() => category.addCampaign(campaign))
                .toThrow(new Error(MESSAGES.INSTANCE_OF_ERROR('Campaign')));
        });
    });
    describe('removing Campaign from Category ->', () => {
        it('when trying to remove bound campaign, expect removed', () => {
            const category = new Category('Food');
            const campaign = new Campaign(
                { category, minQuantity: 5, value: 50, type: CONSTANTS.DISCOUNT_TYPE.RATE }
            );
            category.removeCampaign(campaign);

            const removedCampaign = category.campaigns.find((_campaign) => _campaign === campaign);
            expect(removedCampaign).toBeUndefined();
        });
        it('when trying to remove invalid type of Campaign, expect throw instance type Error', () => {
            const category = new Category('Food');
            const campaign = 'campaign';

            expect(() => category.removeCampaign(campaign))
                .toThrow(new Error(MESSAGES.INSTANCE_OF_ERROR('Campaign')));
        });
    });
});
