const helpers = require('../Utils/helpers');
const MESSAGES = require('../Utils/messages');

const Coupon = require('../Coupon/Coupon');
const Product = require('../Product/Product');
const CartHelper = require('./CartHelper');
const Delivery = require('../Delivery/Delivery');

class Cart extends CartHelper {
    constructor(items) {
        super(items);
        this.totalCampaignDiscountPrice = 0;
        this.couponDiscountPrice = 0;
    }

    /**
     * Add Item with product and quantity to cart.
     */
    addItem(product, quantity) {
        if (!(product instanceof Product)) {
            throw new Error(MESSAGES.INSTANCE_OF_ERROR('Product'));
        }

        if (!(helpers.isGreaterThanZero(quantity) && helpers.isInteger(quantity))) {
            throw new Error(MESSAGES.INVALID_QUANTITY);
        }

        // Cart item object
        const item = {
            totalPrice: (product.price * quantity),
            salePriceAfterCampaign: (product.price * quantity),
            campaignDiscountPrice: 0,
            product,
            quantity,
            bestCampaign: null,
        };

        const existingItem = this.getItem(product);

        if (!existingItem) {
            this.items.push(item);
        } else {
            existingItem.quantity += quantity; // benefit from passByReference
        }
    }

    /**
     * Remove Item with all quantities from cart.
     */
    removeItem(product) {
        if (!(product instanceof Product)) {
            throw new Error(MESSAGES.INSTANCE_OF_ERROR('Product'));
        }

        const indexOfCampaign = this.items.findIndex((item) => item.product === product);

        if (indexOfCampaign === -1) {
            throw new Error(MESSAGES.COULD_NOT_FIND_PRODUCT_TO_BE_REMOVED);
        }

        this.items.splice(indexOfCampaign, 1);
    }

    /**
     * Get Item via product from cart.
     */
    getItem(product) {
        return this.items.find((item) => item.product === product);
    }

    /**
     * Calculate Delivery Cost via cart number of delivery and product.
     */
    calculateDeliveryCost() {
        const numberOfDeliveries = this.distinctCategories.length;
        const numberOfProducts = this.items.length;

        return Delivery.calculateCost({ numberOfDeliveries, numberOfProducts });
    }

    /**
     * Apply coupon to cart.
     * Attention! Business logic depends on Coupon Class.
     */
    applyCoupon(coupon) {
        if (!(coupon instanceof Coupon)) {
            throw new Error(MESSAGES.INSTANCE_OF_ERROR('Coupon'));
        }
        if (this.appliedCoupon) {
            throw new Error(MESSAGES.COUPON_ALREADY_USED_IN_CART);
        }

        this.appliedCoupon = coupon;
        this.couponDiscountPrice = coupon.apply(this.totalPriceAfterCampaignDiscount);
    }

    /**
     * Apply campaign to cart.
     * Attention! This function checks all campaigns is satisfied for cart items so input must be empty.
     */
    applyCampaigns() {
        // Find all applicable campaigns for cart items.
        const { applicableCampaigns } = this;

        // There is no applicable campaigns.
        if (!applicableCampaigns.length) {
            return;
        }
        // Check same campaign is used before!.
        if (this.applicableCampaigns.includes(...this.appliedCampaigns)) {
            throw new Error(MESSAGES.CAMPAIGN_ALREAY_USED_IN_CART);
        }
        // When applied coupon, it must no be apply campaign discount!
        if (this.couponDiscountPrice > 0) {
            throw new Error(MESSAGES.CAMPAIGN_NOT_USED_AFTER_COUPON_APPLIED);
        }

        // Ready to apply best campaign
        this.items.forEach((cartItem) => {
            const { product } = cartItem;
            const { totalPrice } = cartItem; // total price of product with quantity
            let bestDiscountPrice = 0;
            let bestApplicableCampaign = null;

            const findMaxDiscount = (category) => {
                const applicableCampaign = applicableCampaigns.find((campaign) => campaign.category === category);

                // when applicableCampaign found for category of item, calculate campaignDiscountPrice and check it!
                if (applicableCampaign) {
                    const campaignDiscountPrice = applicableCampaign.apply(totalPrice);
                    // check applicableCampaign is satisfied for product
                    if (campaignDiscountPrice > bestDiscountPrice) {
                        bestDiscountPrice = campaignDiscountPrice;
                        bestApplicableCampaign = applicableCampaign;
                    }
                }

                // when category is child, try to find recursively best discount campaign for this item.
                if (category.hasParent) {
                    findMaxDiscount(category.parentCategory);
                }
            };

            findMaxDiscount(product.category);

            cartItem.bestCampaign = bestApplicableCampaign;
            cartItem.salePriceAfterCampaign = totalPrice - bestDiscountPrice;
            cartItem.campaignDiscountPrice = bestDiscountPrice;

            this.appliedCampaigns.push(cartItem.bestCampaign);
            this.totalCampaignDiscountPrice += cartItem.campaignDiscountPrice;
        });
    }
}

module.exports = Cart;
