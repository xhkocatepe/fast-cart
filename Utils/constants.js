module.exports.DISCOUNT_TYPE = {
    RATE: 'RATE',
    AMOUNT: 'AMOUNT',
};

module.exports.DELIVERY = {
    BASE_SHIPPING_AMOUNT: {
        STANDART: 4.99,
        PREMIUM: 2.99,
        GOLD: 1.99,
    },
    PER_PIECE_AMOUNT: {
        STANDART: 3,
        PREMIUM: 2,
        GOLD: 1,
    },
    SCORE: {
        PER_DELIVERY: -20,
        PER_PRODUCT: 5,
        BASE_LIMIT_GOLD: 0,
        BASE_LIMIT_PREMIUM: 15,
    },
};

module.exports.MAX_RATE = 100;

module.exports.MIN_RATE = 0;
