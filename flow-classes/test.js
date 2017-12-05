// @flow

const test = require("ava");
const {Item, Shop, Wallet} = require(".");

test("I can buy something from the shop", t => {
  const shop = new Shop({
    stock: {
      orange: new Item(19, {silver: 7}),
      apple: new Item(42, {silver: 1}),
      "magic missile spell": new Item(2, {silver: 92}),
    },
  });
  const wallet = new Wallet({silver: 21});

  const basket = shop.basket();
  basket.pickUp("orange");
  basket.pickUp("apple");

  const items = basket.checkout(wallet);

  t.deepEqual(items, ["orange", "apple"]);
  t.is(wallet.silver, 13);
  t.deepEqual(shop.stock, {
    orange: new Item(18, {silver: 7}),
    apple: new Item(41, {silver: 1}),
    "magic missile spell": new Item(2, {silver: 92}),
  });
});

test("throw me out if I don't have enough money in my wallet", t => {
  const shop = new Shop({
    stock: {
      orange: new Item(45, {silver: 7}),
      apple: new Item(6, {silver: 1}),
      "healing potion": new Item(6, {silver: 18}),
    },
  });
  const wallet = new Wallet({silver: 13});

  const basket = shop.basket();
  basket.pickUp("healing potion");

  t.throws(() => basket.checkout(wallet), "Get out of here!");
});

test.skip("don't let me pick up non-existent material", t => {
  const shop = new Shop({
    stock: {
      orange: new Item(23, {silver: 7}),
      apple: new Item(81, {silver: 1}),
      raven: new Item(2, {silver: 51}),
    },
  });
  const wallet = new Wallet({silver: 91});
  const basket = shop.basket();

  t.throws(() => basket.pickUp("bigfoot"));
});

test.skip("wallets can't contain livestock", t => {
  t.throws(() => new Wallet({pigs: 2}));
});
