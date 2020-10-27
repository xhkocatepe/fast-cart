const Delivery = require('../Delivery/Delivery');
const StandartDeliveryStrategy = require('../DeliveryStrategy/Delivery/StandartDeliveryStrategy');
const PremiumDeliveryStrategy = require('../DeliveryStrategy/Delivery/PremiumDeliveryStrategy');
const GoldDeliveryStrategy = require('../DeliveryStrategy/Delivery/GoldDeliveryStrategy');

describe('delivery.js side ->', () => {
    describe('when calculating cost ->', () => {
        const numberOfProducts = 10;
        const numberOfDeliveries = 5;

        it('delivery score is', () => {
            const deliveryScore = Delivery.calculateDeliveryScore({ numberOfProducts, numberOfDeliveries });

            expect(deliveryScore).toStrictEqual(-50);
        });

        it('delivery strategy is', () => {
            const deliveryScore = Delivery.calculateDeliveryScore({ numberOfProducts, numberOfDeliveries });

            const deliveryStrategy = Delivery.getDeliveryStrategy(deliveryScore);

            expect(new GoldDeliveryStrategy()).toStrictEqual(deliveryStrategy);
        });

        it('delivery amount is', () => {
            const deliveryAmount = Delivery.calculateCost({ numberOfProducts, numberOfDeliveries });

            expect(deliveryAmount).toStrictEqual(11.99);
        });

        it('when score <= 0, strategy must be goldDeliveryStrategy', () => {
            const deliveryScore = -15;
            const deliveryStrategy = Delivery.getDeliveryStrategy(deliveryScore);

            expect(new GoldDeliveryStrategy()).toStrictEqual(deliveryStrategy);
        });

        it('when score > 0 and score <= 15, strategy must be premiumDeliveryStrategy', () => {
            const deliveryScore = 11;
            const deliveryStrategy = Delivery.getDeliveryStrategy(deliveryScore);

            expect(new PremiumDeliveryStrategy()).toStrictEqual(deliveryStrategy);
        });

        it('when score > 15, strategy must be standartDeliveryStrategy', () => {
            const deliveryScore = 20;
            const deliveryStrategy = Delivery.getDeliveryStrategy(deliveryScore);

            expect(new StandartDeliveryStrategy()).toStrictEqual(deliveryStrategy);
        });
    });
});
