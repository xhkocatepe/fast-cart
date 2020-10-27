class CartHelper {
    constructor(items = []) {
        this.items = items;
        this.appliedCoupon = null;
        this.appliedCampaigns = [];
    }

    /**
     * Get distinct categories without category.
     * Ex:
     *      Category: Food, Electronic, Telephone (root category = Electronic)
     *      Item1: CategoryFood, Item2: CategoryTelephone
     *      return [CategoryFood, CategoryTelephone]
     */
    get distinctCategories() {
        return this.items.map((item) => item.product.category)
            .filter((value, index, self) => self.indexOf(value) === index);
    }

    /**
     * Get distinct categories with child category.
     * Ex:
     *      Category: Food, Electronic, Telephone (root category = Electronic)
     *      Item1: CategoryFood, Item2: CategoryTelephone
     *      return [CategoryFood, CategoryElectronic, CategoryTelephone]
     */
    get distinctCategoriesWithParents() {
        const distinctWithFlatten = [];
        this.items.forEach((item) => {
            const { category } = item.product;
            const addDistinctCategory = (_category) => {
                if (distinctWithFlatten.includes(_category)) {
                    return;
                }

                distinctWithFlatten.push(_category);

                // be careful! do not forget parent category
                if (_category.hasParent) {
                    addDistinctCategory(category.parentCategory);
                }
            };
            addDistinctCategory(category);
        });

        return distinctWithFlatten;
    }

    /**
     * Get applicable campaigns.
     * When getting categories on cart, check satisfies for campaigns.
     * one rule! campaign min quantity <= total quantity of a category.
     */
    get applicableCampaigns() {
        const distinctCategories = this.distinctCategoriesWithParents;
        const applicableCampaigns = [];
        // make decision which one suitable for your cart.
        distinctCategories.forEach((category) => {
            const applicableCampaign = category.campaigns.filter(
                (campaign) => campaign.minQuantity <= this.getTotalQuantityOfCategory(category)
            );
            applicableCampaigns.push(...applicableCampaign);
        });
        return applicableCampaigns;
    }

    /**
     * Get total product quantity on cart.
     */
    get totalQuantity() {
        return this.items.reduce((accumulator, current) => accumulator + current.quantity, 0);
    }

    /**
     * Get total product quantity belongs to category on cart.
     */
    getTotalQuantityOfCategory(category) {
        let totalCategoryQuantity = 0;
        this.items.forEach((item) => {
            const calculateQuantity = (_category) => {
                if (category === _category) totalCategoryQuantity += item.quantity;

                // be careful! do not forget parent category quantities
                if (_category.hasParent) {
                    calculateQuantity(_category.parentCategory);
                }
            };
            calculateQuantity(item.product.category);
        });
        return totalCategoryQuantity;
    }

    /**
     * Get total price without any campaign or coupon discounts on cart.
     */
    get totalPrice() {
        return this.items.reduce((accumulator, current) => accumulator + current.totalPrice, 0);
    }

    /**
     * Get total price after applied campaign discounts on cart.
     */
    get totalPriceAfterCampaignDiscount() {
        return this.items.reduce((accumulator, current) => accumulator + current.salePriceAfterCampaign, 0);
    }

    /**
     * Get total price after applied campaign and coupon discounts on cart.
     */
    get totalPriceOverAll() {
        return this.totalPriceAfterCampaignDiscount - this.couponDiscountPrice;
    }
}

module.exports = CartHelper;
