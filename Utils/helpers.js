module.exports.isNumber = (value) => typeof value === 'number' && !isNaN(value);

module.exports.isInteger = (value) => Number.isInteger(value);

module.exports.isGreaterThanZero = (value) => typeof value === 'number' && value > 0;

module.exports.isGreaterThanEqualZero = (value) => typeof value === 'number' && value >= 0;

module.exports.isLessThanZero = (value) => typeof value === 'number' && value < 0;
