![GitHub package.json version](https://img.shields.io/github/package-json/v/xhkocatepe/fast-cart)  ![GitHub](https://img.shields.io/github/license/xhkocatepe/fast-cart) 
# Fast CarT -  Happy Trading! 

Fast CarT-Trade application is implemented with Nodejs.

App provides as business impacts:
* Get an empty cart and start shopping!
* Creating a new Cart,
* Add/Remove items with quantity to cart, 
* Apply campaigns to cart. 
* Apply a coupon to cart. 
* Calculate delivery cost which depends on delivery badge!
* PS: Do not forget 
    * Create categories which may have parents.
    * Create products which belongs to category.

#Installation

```
git clone https://github.com/xhkocatepe/fast-cart.git
npm install
npm test
npm run coverage
```

![](./images/coverage.gif)

# Over All Case Shows

Please follow this test for explain all cases.

[./Test/Cart.spec.js OverAllCase](https://github.com/xhkocatepe/fast-cart/blob/177bbac44b14fba5376a12616e0991a7d41c6e8d/Test/Cart.spec.js#L55)

![](./images/overall-case.png)

# Coverage Report Result

```
git clone https://github.com/xhkocatepe/fast-cart.git
npm install
npm run coverage
Open any browser
http://localhost:63342/fast-cart/coverage/lcov-report/index.html
```

![](./images/code-coverage.png)
