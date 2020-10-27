const Cart = require('../Cart/Cart');
const Coupon = require('../Coupon/Coupon');
const Category = require('../Category/Category');
const Product = require('../Product/Product');
const Campaign = require('../Campaign/Campaign');
const { DISCOUNT_TYPE } = require('../Utils/constants');
const MESSAGES = require('../Utils/messages');

describe('cart side', () => {
    /**
     * Categories
     */
    const cosmeticRootCategory = new Category('Cosmetic');
    // SubCategories
    const makeUpChildCategory = new Category('Make Up', cosmeticRootCategory);
    const bodyCareChildCategory = new Category('Body Care', cosmeticRootCategory);
    // Deep SubCategories
    const lipChildCategory = new Category('lip', makeUpChildCategory);

    /**
     * Products
     */
    const lipLinerProduct = new Product({ title: 'Lip Liner', price: 50, category: lipChildCategory });
    const lipStickProduct = new Product({ title: 'Lip Stick', price: 110, category: lipChildCategory });
    const bodyLotionProduct = new Product({ title: 'Body Lotion', price: 80, category: bodyCareChildCategory });

    /**
     * Campaigns
     */
    // %20 discount when minimum 5 cosmeticRootCategory products
    const cosmeticCampaign = new Campaign(
        { category: cosmeticRootCategory, minQuantity: 5, value: 20, type: DISCOUNT_TYPE.RATE }
    );
    // %30 discount when minimum 3 makeup products
    const makeUpCampaign = new Campaign(
        { category: makeUpChildCategory, minQuantity: 3, value: 30, type: DISCOUNT_TYPE.RATE }
    );
    // 75 TL discount when minimum 1 makeUpChildCategory products.
    const bodyCareCampaign = new Campaign(
        { category: bodyCareChildCategory, minQuantity: 2, value: 75, type: DISCOUNT_TYPE.AMOUNT }
    );

    /**
     * Coupons
     */
    // 70 TL discount when total price greater than 200 TL on cart
    const couponSmall = new Coupon({ minPrice: 200, value: 70, type: DISCOUNT_TYPE.AMOUNT });

    // 120 TL discount when total price greater than 300 TL on cart
    const couponMedium = new Coupon({ minPrice: 300, value: 120, type: DISCOUNT_TYPE.AMOUNT });

    // %40 discount when total price greater than 500 TL on cart
    const couponLarge = new Coupon({ minPrice: 500, value: 40, type: DISCOUNT_TYPE.RATE });

    describe('!! OVER ALL CASE !! used almost all edge cases -> campaign, coupon, different SubCategories', () => {
        const cart = new Cart();
        cart.addItem(lipLinerProduct, 2);
        cart.addItem(lipStickProduct, 2);
        cart.addItem(bodyLotionProduct, 5);

        /**
         *  !!!! Attention !!!!
         *  Please look at above the describe to learn Campaign, Category, Product, Coupon
         *  !!!! Attention !!!!
         *
         *  Caught 3 ApplicableCampaigns! ->
         *           cosmeticCampaign (limit: 5),
         *           bodyCareCampaign (limit: 2),
         *           makeUpCampaign (limit: 3)
         *
         *  Apply Campaign according to a Product Category!
         *
         *  Item1 -> lipLinerProduct  => 50 * 2 = 100 TL
         *  ✅ makeUpCampaign:      minQuantity 3 >= 2 | 100 % 30         => 30 TL
         *  ⛔ cosmeticCampaign:    minQuantity 5 >= 5 | 100 % 20         => 20 TL
         *  makeUpCampaign  > cosmeticCampaign ( 30 TL > 20 TL)
         *
         *  Item2 -> lipStickProduct => 110 * 2 = 220 TL
         *  ✅ makeUpCampaign:      minQuantity 3 >= 2 | 220 % 30         => 66 TL
         *  ⛔ cosmeticCampaign:    minQuantity 5 >= 5 | 220 % 20         => 22 TL
         *  makeUpCampaign  > cosmeticCampaign ( 66 TL > 22 TL)
         *
         *  Item3 -> bodyLotionProduct => 80 * 5 = 400 TL
         *  ✅ cosmeticCampaign:    minQuantity 5 >= 5 | 400 % 20          => 80 TL
         *  ⛔ bodyCareCampaign:    minQuantity 2 >= 2 | 400 of 75 TL      => 75 TL
         *  cosmeticCampaign > bodyCareCampaign ( 80 TL > 75 TL)
         */

        cart.applyCampaigns();
        cart.applyCoupon(couponLarge);

        // Any Guess?? Be Ready to Flight! :)
        it('1-> total price:  720 = 400 + 220 + 100', () => {
            expect(cart.totalPrice).toStrictEqual(720);
        });
        it('2-> total price after campaign discount: 544 = 720 - 176', () => {
            expect(cart.totalPriceAfterCampaignDiscount).toStrictEqual(544);
        });
        it('3-> total price over all: Total - (Campaigns + Coupons) 326.4 = 720 - (176+217.6)', () => {
            expect(cart.totalPriceOverAll).toStrictEqual(326.4);
        });
        it('4-> delivery cost: 4.99 = 1.99 + (3 * 1)', () => {
            expect(cart.calculateDeliveryCost()).toBe(4.99);
        });
        it('5-> totalCampaignDiscountPrice: 176 = 30 + 66 + 80', () => {
            expect(cart.totalCampaignDiscountPrice).toBe((176));
        });
        it('6-> couponDiscountPrice: 217.6 = (720-176) % 40', () => {
            expect(cart.couponDiscountPrice).toBe(217.6);
        });
        // Details
        it('7-> total quantity 9 = 5 + 2 + 2', () => {
            expect(cart.totalQuantity).toBe(9);
        });
        it('total quantity each of included category', () => {
            expect(cart.getTotalQuantityOfCategory(bodyCareChildCategory)).toBe(5);
            expect(cart.getTotalQuantityOfCategory(cosmeticRootCategory)).toBe(9);
            expect(cart.getTotalQuantityOfCategory(makeUpChildCategory)).toBe(4);
            expect(cart.getTotalQuantityOfCategory(lipChildCategory)).toBe(4);
        });
        it('coupon: couponLarge', () => {
            expect(cart.appliedCoupon).toBe(couponLarge);
        });
        it('applicableCampaigns: ->', () => {
            expect(cart.applicableCampaigns).toHaveLength(3);
            expect(cart.applicableCampaigns).toContain(cosmeticCampaign);
            expect(cart.applicableCampaigns).toContain(bodyCareCampaign);
            expect(cart.applicableCampaigns).toContain(makeUpCampaign);
        });
        it('appliedCampaigns: ->', () => {
            expect(cart.appliedCampaigns).toHaveLength(3);
            expect(cart.appliedCampaigns).toContain(cosmeticCampaign);
            expect(cart.appliedCampaigns).toContain(makeUpCampaign);
        });
        it('expect best campaign is for lipLiner Product ->', () => {
            expect(cart.getItem(lipLinerProduct).bestCampaign).toStrictEqual(makeUpCampaign);
        });
        it('expect best campaign is for lipStick Product ->', () => {
            expect(cart.getItem(lipStickProduct).bestCampaign).toStrictEqual(makeUpCampaign);
        });
        it('expect best campaign is for bodyLotion Product ->', () => {
            expect(cart.getItem(bodyLotionProduct).bestCampaign).toStrictEqual(cosmeticCampaign);
        });
    });

    describe('when apply campaigns to cart', () => {
        describe('campaign is applied to rootCategory, product belongs to childCategory ->', () => {
            describe('no campaign applied!', () => {
                const cart = new Cart();
                cart.addItem(lipLinerProduct, 1);
                cart.applyCampaigns(); // Empty Array because of minQuantity < categoryQuantity
                it('total campaign discount price: 0', () => {
                    expect(cart.applicableCampaigns).toHaveLength(0);
                    expect(cart.applicableCampaigns).not.toContain(makeUpCampaign);
                    expect(cart.totalCampaignDiscountPrice).toBe(0);
                });
            });
            describe('subCategory of campaign applied!', () => {
                const cart = new Cart();
                cart.addItem(lipLinerProduct, 4);
                cart.applyCampaigns(); // Hey! We caught campaign! 50 * 4 = 200 %30 = 60 TL.
                it('total campaign discount price: 0', () => {
                    expect(cart.applicableCampaigns).toHaveLength(1);
                    expect(cart.applicableCampaigns).toContain(makeUpCampaign);
                    expect(cart.totalCampaignDiscountPrice).toBe(60);
                });
            });
            describe('can not apply one more time', () => {
                const cart = new Cart();
                cart.addItem(lipLinerProduct, 4);
                cart.applyCampaigns(); // Hey! We caught campaign! 50 * 4 = 200 %30 = 60 TL.
                it('throws error already used same campaign!', () => {
                    expect(() => cart.applyCampaigns()).toThrow(MESSAGES.CAMPAIGN_ALREAY_USED_IN_CART);
                });
            });
        });
        describe('multiple applicable campaigns try to be applied ->', () => {
            describe('expects caught best campaign!', () => {
                describe('with single product', () => {
                    const cart = new Cart();
                    cart.addItem(lipStickProduct, 5);
                    // Caught 2 ApplicableCampaigns! (cosmetic + makeup)
                    cart.applyCampaigns();
                    // Apply best Campaign!
                    // cosmeticCampaign: 110 * 5 = 550 % 20 = 110 TL
                    // makeUpCampaign: 110 * 5 = 550 % 30 = 165 TL
                    it('expect apply the best campaign!', () => expect(cart.totalCampaignDiscountPrice).toBe(165));
                    it('expect best campaign is ->', () => expect(cart.appliedCampaigns).toContain(makeUpCampaign));
                });
                describe('with multiple products - same category', () => {
                    const cart = new Cart();
                    cart.addItem(lipLinerProduct, 1); // 50 * 1 = 50 TL
                    cart.addItem(lipStickProduct, 2); // 110 * 2 = 220 TL
                    // Caught 1 ApplicableCampaigns! -> makeUpCampaign
                    // %30 of 270 TL =  81 TL
                    cart.applyCampaigns();
                    it('applicableCampaigns: 1 ->', () => {
                        expect(cart.applicableCampaigns).toHaveLength(1);
                        expect(cart.applicableCampaigns).toContain(makeUpCampaign);
                    });
                    it('expect apply the best campaign!', () => expect(cart.totalCampaignDiscountPrice).toBe(81));
                    it('expect best campaign is ->', () => expect(cart.appliedCampaigns).toContain(makeUpCampaign));
                });
                describe('!! EXTRA CASE !! with multiple products, different category different campaigns', () => {
                    const cart = new Cart();
                    cart.addItem(lipLinerProduct, 2); // 50 * 2 = 100 TL
                    cart.addItem(bodyLotionProduct, 3); // 80 * 3 = 240 TL

                    /**
                     *  Caught 2 ApplicableCampaigns! -> cosmeticCampaign (limit: 5), bodyCareCampaign (limit: 2)
                     *  Apply Campaign according to a Product Category!
                     *
                     *  Item1 -> bodyLotionProduct
                     *  cosmeticCampaign:    minQuantity 5 >= 5 | 240 % 20         => 48 TL
                     *  bodyCareCampaign:    minQuantity 2 >= 2 | 240 of 75 TL     => 75 TL
                     *  bodyCareCampaign > cosmeticCampaign ( 75 TL > 48 TL)

                     *  Item2 -> lipLinerProduct
                     *  cosmeticCampaign:    minQuantity 5 >= 5 | 100 % 20   => 20 TL
                     */

                    cart.applyCampaigns();
                    it('applicableCampaigns: 1 ->', () => {
                        expect(cart.applicableCampaigns).toHaveLength(2);
                        expect(cart.applicableCampaigns).toContain(cosmeticCampaign);
                        expect(cart.applicableCampaigns).toContain(bodyCareCampaign);
                    });
                    // Any Guess?? :)
                    it('expect totalCampaignDiscountPrice = 95', () => {
                        expect(cart.totalCampaignDiscountPrice).toBe((75 + 20));
                    });
                    it('expect best campaign is for lipLiner Product ->', () => {
                        expect(cart.getItem(lipLinerProduct).bestCampaign).toStrictEqual(cosmeticCampaign);
                    });
                    it('expect best campaign is for bodyLotion Product ->', () => {
                        expect(cart.getItem(bodyLotionProduct).bestCampaign).toStrictEqual(bodyCareCampaign);
                    });
                });
                describe('!! EXTRA CASE !! with multiple products, different category same campaigns', () => {
                    const cart = new Cart();
                    cart.addItem(lipLinerProduct, 2); // 50 * 2 = 100 TL
                    cart.addItem(bodyLotionProduct, 5); // 80 * 5 = 400 TL

                    /**
                     *  Caught 2 ApplicableCampaigns! -> cosmeticCampaign (limit: 5), bodyCareCampaign (limit: 2)
                     *  Apply Campaign according to a Product Category!
                     *
                     *  Item1 -> bodyLotionProduct
                     *  cosmeticCampaign:    minQuantity 5 >= 5 | 400 % 20         => 80 TL
                     *  bodyCareCampaign:    minQuantity 2 >= 2 | 500 of 75 TL     => 75 TL
                     *  cosmeticCampaign > bodyCareCampaign ( 80 TL > 75 TL)

                     *  Item2 -> lipLinerProduct
                     *  cosmeticCampaign:    minQuantity 5 >= 5 | 100 % 20   => 20 TL
                     */

                    cart.applyCampaigns();
                    it('applicableCampaigns: 1 ->', () => {
                        expect(cart.applicableCampaigns).toHaveLength(2);
                        expect(cart.applicableCampaigns).toContain(cosmeticCampaign);
                        expect(cart.applicableCampaigns).toContain(bodyCareCampaign);
                    });
                    // Any Guess?? :)
                    it('expect totalCampaignDiscountPrice = 100', () => {
                        expect(cart.totalCampaignDiscountPrice).toBe((80 + 20));
                    });
                    it('expect best campaign is for lipLiner Product ->', () => {
                        expect(cart.getItem(lipLinerProduct).bestCampaign).toStrictEqual(cosmeticCampaign);
                    });
                    it('expect best campaign is for bodyLotion Product ->', () => {
                        expect(cart.getItem(bodyLotionProduct).bestCampaign).toStrictEqual(cosmeticCampaign);
                    });
                });
            });
        });
    });
    describe('when apply coupon as a discount', () => {
        it('applied coupon', () => {
            const cart = new Cart();
            cart.addItem(bodyLotionProduct, 5); // 80 * 5 = 400 TL >  couponLarge.minPrice = 300 TL
            cart.applyCoupon(couponMedium); // couponMedium -> 120 of 300 Tl
            expect(cart.couponDiscountPrice).toStrictEqual(120);
            expect(cart.appliedCoupon).toStrictEqual(couponMedium);
            expect(cart.totalPriceOverAll).toStrictEqual(400 - 120);
        });

        it('when minPrice greater than price, expects throw insufficient limit error!', () => {
            const cart = new Cart();
            cart.addItem(bodyLotionProduct, 3); // 240 TL < couponLarge.minPrice = 300 TL

            expect(() => cart.applyCoupon(couponLarge))
                .toThrow(MESSAGES.COUPON_INSUFFICIENT_LIMIT);
        });
        it('when coupon is not instanceOf Coupon, expects throw instanceOf error!', () => {
            const cart = new Cart();
            cart.addItem(bodyLotionProduct, 3); // 240 TL < couponLarge.minPrice = 300 TL
            const couponInvalid = 'invalidCoupon';
            expect(() => cart.applyCoupon(couponInvalid))
                .toThrow(MESSAGES.INSTANCE_OF_ERROR('Coupon'));
        });
        it('after applied Coupon, again try to add another coupon, expects throw only one coupon error!', () => {
            const cart = new Cart();
            cart.addItem(bodyLotionProduct, 5); // 240 TL < couponLarge.minPrice = 300 TL
            cart.applyCoupon(couponSmall);
            expect(() => cart.applyCoupon(couponMedium))
                .toThrow(MESSAGES.COUPON_ALREADY_USED_IN_CART);
        });
        it('after applied coupon, campaign can not be used, expect throws error', () => {
            const cart = new Cart();
            cart.addItem(lipLinerProduct, 5);
            cart.applyCoupon(couponSmall);

            expect(() => cart.applyCampaigns(cosmeticCampaign))
                .toThrow(MESSAGES.CAMPAIGN_NOT_USED_AFTER_COUPON_APPLIED);
        });
    });
    describe('when calculate delivery cost for cart', () => {
        it('expect delivery cost for number of products and deliveries', () => {
            const cart = new Cart();
            cart.addItem(bodyLotionProduct, 2);
            cart.addItem(lipLinerProduct, 2);
            cart.addItem(lipStickProduct, 5);

            expect(cart.calculateDeliveryCost()).toStrictEqual(4.99);
        });
    });
    describe('when get, add, remove items on cart', () => {
        describe('add item ->', () => {
            it('when first adding Item to Cart, expect cart.items array returns 1 item', () => {
                const cart = new Cart();
                cart.addItem(bodyLotionProduct, 2);

                expect(cart.items).toHaveLength(1);
                expect(cart.getItem(bodyLotionProduct).product).toStrictEqual(bodyLotionProduct);
            });

            it('when one more than adding Item to Cart, expect only items quantity count increase', () => {
                const cart = new Cart();
                cart.addItem(bodyLotionProduct, 2);
                cart.addItem(bodyLotionProduct, 3);

                expect(cart.items).toHaveLength(1);
                expect(cart.getItem(bodyLotionProduct).product).toStrictEqual(bodyLotionProduct);
                expect(cart.getItem(bodyLotionProduct).quantity).toStrictEqual(2 + 3);
            });

            it('when add invalid type of item, expect throw invalid instance of product!', () => {
                const cart = new Cart();
                const invalidProduct = 'invalidProduct';

                expect(() => cart.addItem(invalidProduct, 3))
                    .toThrow(new Error(MESSAGES.INSTANCE_OF_ERROR('Product')));
            });

            it('when add valid product but negative value quantity, expect throw invalid quantity error!', () => {
                const cart = new Cart();
                const invalidQuantity = -5;

                expect(() => cart.addItem(bodyLotionProduct, invalidQuantity))
                    .toThrow(new Error(MESSAGES.INVALID_QUANTITY));
            });

            it('when add valid product but not integer value quantity, expect throw invalid quantity error!', () => {
                const cart = new Cart();
                const invalidQuantity = 1.5;

                expect(() => cart.addItem(bodyLotionProduct, invalidQuantity))
                    .toThrow(new Error(MESSAGES.INVALID_QUANTITY));
            });
        });

        describe('remove item ->', () => {
            it('when remove item, expects delete item with all quantities!', () => {
                const cart = new Cart();
                cart.addItem(bodyLotionProduct, 3);
                cart.removeItem(bodyLotionProduct);

                expect(cart.getItem(bodyLotionProduct)).toBeUndefined();
            });

            it('when remove invalid type of item, expect throw invalid instance of product!', () => {
                const cart = new Cart();
                const invalidProduct = 'invalidProduct';
                cart.addItem(bodyLotionProduct, 3);


                expect(() => cart.removeItem(invalidProduct))
                    .toThrow(new Error(MESSAGES.INSTANCE_OF_ERROR('Product')));
            });

            it('when remove valid product but not in cart, expect throw no product on cart!', () => {
                const cart = new Cart();
                cart.addItem(bodyLotionProduct, 3);


                expect(() => cart.removeItem(lipLinerProduct))
                    .toThrow(new Error(MESSAGES.COULD_NOT_FIND_PRODUCT_TO_BE_REMOVED));
            });
        });

        describe('get item ->', () => {
            it('when adding item, get item equals adding Item', () => {
                const cart = new Cart();
                cart.addItem(bodyLotionProduct, 3);

                expect(cart.getItem(bodyLotionProduct).product).toStrictEqual(bodyLotionProduct);
            });
            it('when there is no items on cart, get item return undefined', () => {
                const cart = new Cart();

                expect(cart.getItem(bodyLotionProduct)).toBeUndefined();
            });
        });
    });
});
