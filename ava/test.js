const test = require("ava");
const {aShop} = require(".");

test("I can buy something from the shop", t => {
  const shop = aShop({
    stock: {
      orange: {quantity: 19, price: {silver: 7}},
      apple: {quantity: 42, price: {silver: 1}},
      "magic missile spell": {quantity: 2, price: {silver: 92}},
    },
  });
  const wallet = {silver: 21};

  const basket = shop.basket();
  basket.pickUp("orange");
  basket.pickUp("apple");

  const items = basket.checkout(wallet);

  t.deepEqual(items, ["orange", "apple"]);
  t.deepEqual(wallet, {silver: 13});
  t.deepEqual(shop.stock, {
    orange: {quantity: 18, price: {silver: 7}},
    apple: {quantity: 41, price: {silver: 1}},
    "magic missile spell": {quantity: 2, price: {silver: 92}},
  });
});

test("throw me out if I don't have enough money in my wallet", t => {
  const shop = aShop({
    stock: {
      orange: {quantity: 45, price: {silver: 7}},
      apple: {quantity: 6, price: {silver: 1}},
      "healing potion": {quantity: 6, price: {silver: 18}},
    },
  });
  const wallet = {silver: 13};

  const basket = shop.basket();
  basket.pickUp("healing potion");

  t.throws(() => basket.checkout(wallet), "Get out of here!");
});

test("don't let me pick up non-existent material", t => {
  const shop = aShop({
    stock: {
      orange: {quantity: 23, price: {silver: 7}},
      apple: {quantity: 81, price: {silver: 1}},
      raven: {quantity: 2, price: {silver: 51}},
    },
  });
  const wallet = {silver: 91};
  const basket = shop.basket();

  t.throws(() => basket.pickUp("bigfoot"), "Hey, we don't stock bigfoot!");
});

test("throw me out if I try to pay with livestock", t => {
  const shop = aShop({
    stock: {
      orange: {quantity: 81, price: {silver: 7}},
      apple: {quantity: 96, price: {silver: 1}},
      "massive explosions in a jar": {quantity: 1, price: {silver: 184}},
    },
  });
  const wallet = {pigs: 2};

  const basket = shop.basket();
  basket.pickUp("apple");

  t.throws(() => basket.checkout(wallet), "Get out of here!");
});
