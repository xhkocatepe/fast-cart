const helpers = require('../Utils/helpers');

describe('helpers side', () => {
    describe('isNumber checks', () => {
        it('when entering NaN as number, expect false', () => {
            expect(helpers.isNumber(NaN)).toBe(false);
        });
        it('when entering -7 as number, expect true', () => {
            expect(helpers.isNumber(-7)).toBe(true);
        });
        it('when entering 20 as number, expect true', () => {
            expect(helpers.isNumber(20)).toBe(true);
        });
    });
    describe('isInteger checks', () => {
        it('when entering NaN as number, expect false', () => {
            expect(helpers.isInteger(NaN)).toBe(false);
        });
        it('when entering 7.5 as positive number, expect false', () => {
            expect(helpers.isInteger(7.5)).toBe(false);
        });
        it('when entering -7 as negative number, expect true', () => {
            expect(helpers.isInteger(-7)).toBe(true);
        });
        it('when entering 20 as positive number, expect true', () => {
            expect(helpers.isInteger(20)).toBe(true);
        });
    });
    describe('isGreaterThanZero checks', () => {
        it('when entering 0 as number, expect false', () => {
            expect(helpers.isGreaterThanZero(0)).toBe(false);
        });
        it('when entering 7.5 as positive number, expect true', () => {
            expect(helpers.isGreaterThanZero(7.5)).toBe(true);
        });
        it('when entering -7 as negative number, expect false', () => {
            expect(helpers.isGreaterThanZero(-7)).toBe(false);
        });
        it('when entering 20 as positive number, expect true', () => {
            expect(helpers.isGreaterThanZero(20)).toBe(true);
        });
    });
    describe('isLessThanZero checks', () => {
        it('when entering 0 as number, expect false', () => {
            expect(helpers.isLessThanZero(0)).toBe(false);
        });
        it('when entering 7.5 as positive number, expect false', () => {
            expect(helpers.isLessThanZero(7.5)).toBe(false);
        });
        it('when entering -7 as negative number, expect true', () => {
            expect(helpers.isLessThanZero(-7)).toBe(true);
        });
        it('when entering 20 as positive number, expect false', () => {
            expect(helpers.isLessThanZero(20)).toBe(false);
        });
    });
    describe('isGreaterThanEqualZero checks', () => {
        it('when entering 0 as number, expect true', () => {
            expect(helpers.isGreaterThanEqualZero(0)).toBe(true);
        });
        it('when entering 8.5 as positive number, expect true', () => {
            expect(helpers.isGreaterThanEqualZero(8.5)).toBe(true);
        });
        it('when entering -5 as negative number, expect false', () => {
            expect(helpers.isGreaterThanEqualZero(-5)).toBe(false);
        });
        it('when entering 25 as positive number, expect true', () => {
            expect(helpers.isGreaterThanEqualZero(25)).toBe(true);
        });
    });
});
