const Cart = require('../Cart/Cart');
const Category = require('../Category/Category');
const Product = require('../Product/Product');
const Campaign = require('../Campaign/Campaign');
const { DISCOUNT_TYPE } = require('../Utils/constants');

describe('cartHelper side', () => {
    const categoryFood = new Category('Food');
    const categoryCar = new Category('Car');
    const categorySportCar = new Category('Sport', categoryCar);

    const productApple = new Product({ title: 'Apple', price: 10, category: categoryFood });
    const productToyota = new Product({ title: 'Toyota', price: 2000, category: categoryCar });
    const productMercedes = new Product({ title: 'Mercedes', price: 3000, category: categoryCar });
    const productPeugeot = new Product({ title: 'Peugeot', price: 1500, category: categorySportCar });


    const type = DISCOUNT_TYPE.RATE;
    const campaignFood = new Campaign({ category: categoryFood, minQuantity: 5, value: 20, type });
    const campaignCar = new Campaign({ category: categoryCar, minQuantity: 2, value: 20, type });
    const campaignSportCar = new Campaign({ category: categorySportCar, minQuantity: 2, value: 20, type });

    describe('when adding item into cart', () => {
        const cart = new Cart();
        const category = new Category('Food');
        const product = new Product({ title: 'Orange', price: 5, category });

        it('no addItem to Cart expect items = []', () => {
            expect(cart.items).toStrictEqual([]);
        });

        it('expect totalPrice: 3*5 = 15', () => {
            cart.addItem(product, 3);

            expect(cart.totalPrice).toBe(15);
        });
        it('expect totalPriceAfterCampaignDiscount: 15 (no campaign discount)', () => {
            cart.addItem(product, 3);

            expect(cart.totalPriceAfterCampaignDiscount).toBe(15);
        });
        it('expect totalPriceOverAll: 15 (no campaign and no coupon discount)', () => {
            cart.addItem(product, 3);

            expect(cart.totalPriceOverAll).toBe(15);
        });
        it('expect appliedCampaigns: [] (no applied any campaign', () => {
            cart.addItem(product, 3);

            expect(cart.appliedCampaigns).toHaveLength(0);
        });

        this.appliedCampaigns = [];
    });

    describe('when adding multiple products belongs to different categories into cart', () => {
        it('expect distinct category counts', () => {
            const cart = new Cart();
            cart.addItem(productApple, 2);
            cart.addItem(productToyota, 2);
            cart.addItem(productMercedes, 5);

            expect(cart.distinctCategories).toHaveLength(2);
        });
        it('expect distinct category counts with same category more products', () => {
            const cart = new Cart();
            cart.addItem(productToyota, 2);
            cart.addItem(productMercedes, 5);

            expect(cart.distinctCategories).toHaveLength(1);
        });

        it('expect distinctCategoriesWithParents and distinctCategories are same', () => {
            const cart = new Cart();
            cart.addItem(productToyota, 2);
            cart.addItem(productMercedes, 5);
            cart.addItem(productPeugeot, 5);

            expect(cart.getItem(productPeugeot).product.category.hasParent).toStrictEqual(true);
            expect(cart.distinctCategories).toHaveLength(2);
            expect(cart.distinctCategoriesWithParents).toHaveLength(2);
        });

        it('expect distinctCategoriesWithParents is different from distinctCategories', () => {
            const cart = new Cart();
            cart.addItem(productPeugeot, 5);

            expect(cart.getItem(productPeugeot).product.category.hasParent).toStrictEqual(true);
            expect(cart.distinctCategories).toHaveLength(1);
            expect(cart.distinctCategories).toContain(categorySportCar);
            expect(cart.distinctCategoriesWithParents).toHaveLength(2); // Attention! With Flatten count change
            expect(cart.distinctCategoriesWithParents).toContain(categorySportCar);
            expect(cart.distinctCategoriesWithParents).toContain(categoryCar);
        });
    });


    describe('calculating applicableCampaigns for cart', () => {
        it('expect applicableCampaigns includes cart campaign', () => {
            const cart = new Cart();

            cart.addItem(productApple, 3);
            cart.addItem(productToyota, 1);
            cart.addItem(productMercedes, 1);

            expect(cart.applicableCampaigns).toHaveLength(1);
            expect(cart.applicableCampaigns).toContain(campaignCar);
            expect(cart.applicableCampaigns).not.toContain(campaignFood);
        });

        it('expect applicableCampaigns with hasParent same categories includes cart campaign', () => {
            const cart = new Cart();

            cart.addItem(productToyota, 1);
            cart.addItem(productPeugeot, 3);

            expect(cart.applicableCampaigns).toHaveLength(2);
            expect(cart.applicableCampaigns).toContain(campaignCar);
            expect(cart.applicableCampaigns).toContain(campaignSportCar);
            expect(cart.getTotalQuantityOfCategory(categoryFood)).toStrictEqual(0);
            expect(cart.getTotalQuantityOfCategory(categoryCar)).toStrictEqual(4); // (1 Toyota + 3 Peugeot)
            expect(cart.getTotalQuantityOfCategory(categorySportCar)).toStrictEqual(3); // (3 Peugeot)
        });

        it('expect applicableCampaigns with hasParent different categories includes some cart campaign', () => {
            const cart = new Cart();

            cart.addItem(productApple, 3);
            cart.addItem(productToyota, 1);
            cart.addItem(productPeugeot, 3);

            expect(cart.applicableCampaigns).toHaveLength(2);
            expect(cart.applicableCampaigns).toContain(campaignCar);
            expect(cart.applicableCampaigns).toContain(campaignSportCar);
            expect(cart.applicableCampaigns).not.toContain(campaignFood);
            expect(cart.getTotalQuantityOfCategory(categoryFood)).toStrictEqual(3);
            expect(cart.getTotalQuantityOfCategory(categoryCar)).toStrictEqual(4); // (1 Toyota + 3 Peugeot)
            expect(cart.getTotalQuantityOfCategory(categorySportCar)).toStrictEqual(3); // (3 Peugeot)
        });

        it('expect applicableCampaigns with hasParent different categories includes all cart campaign', () => {
            const cart = new Cart();

            cart.addItem(productApple, 5);
            cart.addItem(productToyota, 1);
            cart.addItem(productPeugeot, 3);

            expect(cart.applicableCampaigns).toHaveLength(3);
            expect(cart.applicableCampaigns).toContain(campaignCar);
            expect(cart.applicableCampaigns).toContain(campaignSportCar);
            expect(cart.applicableCampaigns).toContain(campaignFood);
            expect(cart.getTotalQuantityOfCategory(categoryFood)).toStrictEqual(5);
            expect(cart.getTotalQuantityOfCategory(categoryCar)).toStrictEqual(4); // (1 Toyota + 3 Peugeot)
            expect(cart.getTotalQuantityOfCategory(categorySportCar)).toStrictEqual(3); // (3 Peugeot)
        });
    });

    describe('calculating totalQuantity and totalQuantityOfCategory for cart', () => {
        it('expect totalQuantity and totalQuantityOfCategory is -> (with hasParent same categories)', () => {
            const cart = new Cart();

            cart.addItem(productToyota, 1);
            cart.addItem(productPeugeot, 3);

            expect(cart.totalQuantity).toStrictEqual(4);

            expect(cart.getTotalQuantityOfCategory(categoryFood)).toStrictEqual(0);
            expect(cart.getTotalQuantityOfCategory(categoryCar)).toStrictEqual(4); // (1 Toyota + 3 Peugeot)
            expect(cart.getTotalQuantityOfCategory(categorySportCar)).toStrictEqual(3); // (3 Peugeot)
        });

        it('expect totalQuantity and totalQuantityOfCategory is -> (with hasParent different categories)', () => {
            const cart = new Cart();

            cart.addItem(productApple, 3);
            cart.addItem(productToyota, 1);
            cart.addItem(productPeugeot, 3);

            expect(cart.totalQuantity).toStrictEqual(7);

            expect(cart.getTotalQuantityOfCategory(categoryFood)).toStrictEqual(3);
            expect(cart.getTotalQuantityOfCategory(categoryCar)).toStrictEqual(4); // (1 Toyota + 3 Peugeot)
            expect(cart.getTotalQuantityOfCategory(categorySportCar)).toStrictEqual(3); // (3 Peugeot)
        });
    });
});
