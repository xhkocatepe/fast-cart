const MESSAGES = require('../Utils/messages');

const Category = require('../Category/Category');
const Product = require('../Product/Product');

const categorySample = new Category('Sample');

describe('product side ->', () => {
    describe('creating new Product ->', () => {
        it('when creating valid new Product, expect title is entered string', () => {
            const product = new Product({ title: 'Apple', price: 30, category: categorySample });
            expect(product.title).toStrictEqual('Apple');
        });
        it('when creating valid new Product, expect price is entered number', () => {
            const product = new Product({ title: 'Apple', price: 20, category: categorySample });
            expect(product.price).toStrictEqual(20);
        });
        it('when creating valid new Product, expect price is entered category', () => {
            const product = new Product({ title: 'Apple', price: 20, category: categorySample });
            expect(product.category).toStrictEqual(categorySample);
        });
    });
    describe('throwing validation errors ->', () => {
        it('when adding invalid category, expect throw instance type error', () => {
            const category = 'category';
            const productCreate = () => new Product(
                { title: 'Apple', price: 20, category }
            );

            expect(() => productCreate())
                .toThrow(new Error(MESSAGES.INSTANCE_OF_ERROR('Category')));
        });

        it('when adding less than zero price, expect throw invalid price error', () => {
            const price = -10;
            const productCreate = () => new Product(
                { title: 'Apple', price, category: categorySample }
            );

            expect(() => productCreate())
                .toThrow(new Error(MESSAGES.PRICE_INVALID_ERROR));
        });

        it('when adding less than zero price and invalid category, expect throw instance type error', () => {
            const price = -10;
            const category = 'category';
            const productCreate = () => new Product(
                { title: 'Apple', price, category }
            );

            expect(() => productCreate())
                .toThrow(new Error(
                    MESSAGES.INSTANCE_OF_ERROR('Category')
                ));
        });
    });
});
