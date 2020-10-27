const DeliveryStrategyContext = require('../DeliveryStrategy/Delivery/DeliveryStrategyContext');
const GoldDeliveryStrategy = require('../DeliveryStrategy/Delivery/GoldDeliveryStrategy');
const PremiumDeliveryStrategy = require('../DeliveryStrategy/Delivery/PremiumDeliveryStrategy');
const StandartDeliveryStrategy = require('../DeliveryStrategy/Delivery/StandartDeliveryStrategy');


describe('deliveryStrategyContext.js side ->', () => {
    describe('when creating new DeliveryStrategyContext ->', () => {
        it('strategy equals standartDeliveryStrategy', () => {
            const strategy = new StandartDeliveryStrategy();
            const deliveryStrategyContext = new DeliveryStrategyContext(strategy);

            expect(deliveryStrategyContext.strategy).toStrictEqual(strategy);
        });

        it('strategy equals goldDeliveryStrategy', () => {
            const strategy = new GoldDeliveryStrategy();
            const deliveryStrategyContext = new DeliveryStrategyContext(strategy);

            expect(deliveryStrategyContext.strategy).toStrictEqual(strategy);
        });

        it('strategy equals premiumDeliveryStrategy', () => {
            const strategy = new PremiumDeliveryStrategy();
            const deliveryStrategyContext = new DeliveryStrategyContext(strategy);

            expect(deliveryStrategyContext.strategy).toStrictEqual(strategy);
        });
    });
    describe('when executing delivery strategy ->', () => {
        it('strategy equals standartDeliveryStrategy expect standart delivery cost', () => {
            const strategy = new StandartDeliveryStrategy();
            const deliveryStrategyContext = new DeliveryStrategyContext(strategy);

            expect(deliveryStrategyContext.executeDeliveryStrategy(5)).toStrictEqual(19.99);
        });

        it('strategy equals premiumDeliveryStrategy expect premium delivery cost', () => {
            const strategy = new PremiumDeliveryStrategy();
            const deliveryStrategyContext = new DeliveryStrategyContext(strategy);

            expect(deliveryStrategyContext.executeDeliveryStrategy(5)).toStrictEqual(12.99);
        });

        it('execute goldDeliveryStrategy expect gold delivery cost', () => {
            const strategy = new GoldDeliveryStrategy();
            const deliveryStrategyContext = new DeliveryStrategyContext(strategy);

            expect(deliveryStrategyContext.executeDeliveryStrategy(5)).toStrictEqual(6.99);
        });
    });
});
