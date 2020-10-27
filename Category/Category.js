const Campaign = require('../Campaign/Campaign');
const MESSAGES = require('../Utils/messages');

class Category {
    constructor(title, parentCategory) {
        this.title = title;

        if (parentCategory instanceof Category) {
            this.parentCategory = parentCategory;
        } else if (parentCategory && !(parentCategory instanceof Category)) {
            throw new Error(MESSAGES.INSTANCE_OF_ERROR('Category'));
        }

        this.campaigns = [];
        this.hasParent = !!parentCategory;
    }

    /**
     * Add campaign to a category.
     * A category includes one than more campaigns.
     */
    addCampaign(campaign) {
        if (!(campaign instanceof Campaign)) {
            throw new Error(MESSAGES.INSTANCE_OF_ERROR('Campaign'));
        }

        this.campaigns.push(campaign);
    }

    /**
     * Remove campaign from category.
     */
    removeCampaign(campaign) {
        if (!(campaign instanceof Campaign)) {
            throw new Error(MESSAGES.INSTANCE_OF_ERROR('Campaign'));
        }
        const indexOfCampaign = this.campaigns.findIndex((_campaign) => _campaign === campaign);

        this.campaigns.splice(indexOfCampaign, 1);
    }
}

module.exports = Category;
