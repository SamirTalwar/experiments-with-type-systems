const $ = require("sanctuary-def");

const Item = $.RecordType({
  quantity: $.Integer,
  price: $.RecordType({silver: $.Integer}),
});
const ItemNames = $.Array($.String);
const Stock = $.StrMap(Item);
const ShopOptions = $.RecordType({
  stock: Stock,
});
const Wallet = $.RecordType({silver: $.Integer});
const Basket = $.RecordType({
  pickUp: $.Function([$.String, $.Null]),
  checkout: $.Function([Wallet, ItemNames]),
});
const Shop = $.RecordType({
  stock: Stock,
  basket: $.Function([Basket]),
});
const env = $.env.concat([ShopOptions, Shop]);
const def = $.create({checkTypes: true, env: env});

const aShop = def("aShop", {}, [ShopOptions, Shop], ({stock}) => ({
  stock,
  basket: def("basket", {}, [Basket], () => {
    let items = [];
    const ItemName = $.EnumType("ItemName", "", Object.keys(stock));
    return {
      pickUp: def("pickUp", {}, [ItemName, $.Undefined], itemName => {
        items.push(itemName);
      }),
      checkout: def("checkout", {}, [Wallet, ItemNames], wallet => {
        const price = items
          .map(itemName => stock[itemName].price.silver)
          .reduce((a, b) => a + b);
        if (wallet.silver < price) {
          throw meOut();
        }

        wallet.silver -= price;
        for (let itemName of items) {
          stock[itemName].quantity -= 1;
        }
        const boughtItems = items;
        items = [];
        return boughtItems;
      }),
    };
  }),
}));

const meOut = () => new Error("Get out of here!");

module.exports = {
  aShop,
};
