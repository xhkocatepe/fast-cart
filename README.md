[![Build Status](https://travis-ci.org/xhkocatepe/fast-cart.svg?branch=master)](https://travis-ci.org/xhkocatepe/fast-cart) ![GitHub package.json version](https://img.shields.io/github/package-json/v/xhkocatepe/fast-cart)  ![GitHub](https://img.shields.io/github/license/xhkocatepe/fast-cart) 
# Fast CarT -  Happy Trading! 

Fast CarT-Trade application is completely written in Node.js.

Summary of Business Side:
* Get an empty cart and start shopping!
* Creating a new Cart,
* Add/Remove items with quantity to cart, 
* Apply campaigns to cart. 
* Apply a coupon to cart. 
* Calculate delivery cost which depends on delivery badge!
* PS: Do not forget 
    * Create categories which may have parents.
    * Create products which belongs to category.

![](./images/coverage.gif)


Details of Business Side:
- Category
    - In system, create new Category for defining to product,
    - Category may have parent,
    - Add/remove campaigns to Category. 
- Product
    - In System, create new Product for adding to cart,
    - Product consists of price and category.

- Campaign
    - In system, create new Campaign for using discount to cart,
    - Campaign consists of minimum quantity, discount type (rate, amount) and value,
    - Campaign is applicable to a product of category,
    - One product is only applicable one campaign,
    - After applied coupon, is not allowed to apply campaign.
    - User does not choice campaigns, system has choosen the best applicable campaign for product,
    - The system applies the campaign with the highest discount on the product.’
    - The type of campaign discount is determined according to the Discount Strategy.

- Coupon
    - In system, create new Coupon for using discount to cart,
    - Coupon consists of minimum price, discount type (rate, amount) and value.
    - Coupon is applicable to cart.
    - Only one coupon is applicable to cart.
    - The type of coupon discount is determined according to the Discount Strategy.

- Delivery
    - The system has a badge schema to ensure dynamically of delivery cost,
    - In Delivery Strategy system consists of Gold, Premium and Standart delivery strategy types,
    - Delivery Score is calculated by number of products and deliveries, 
    - Delivery Cost is calculated by number of products through Delivery Strategy like Gold, Premium, Standart.
    
# Installation

```
git clone https://github.com/xhkocatepe/fast-cart.git
npm install
npm test
npm run coverage
```

# Over All Case Shows

Please follow this test for explain all cases.

[./Test/Cart.spec.js OverAllCase](https://github.com/xhkocatepe/fast-cart/blob/177bbac44b14fba5376a12616e0991a7d41c6e8d/Test/Cart.spec.js#L55)

![](./images/overall-case.png)

# Coverage Report Result

```
git clone https://github.com/xhkocatepe/fast-cart.git
npm install
npm run coverage
-Open any browser
http://localhost:63342/fast-cart/coverage/lcov-report/index.html
```

![](./images/code-coverage.png)
