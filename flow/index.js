// @flow

type Item = {
  quantity: number,
  price: {silver: number},
};
type ItemNames = string[];
type ItemName<Stock> = $Enum<Stock>;
type Stock = {[name: string]: Item};
type ShopOptions<S: Stock> = {stock: S};
type Shop<S: Stock> = {
  stock: S,
  basket: () => Basket<S>,
};
type Basket<S> = {
  pickUp: (ItemName<S>) => void,
  checkout: Wallet => ItemNames,
};
type Wallet = {silver: number};

function aShop<S: Stock>({stock}: ShopOptions<S>): Shop<S> {
  return {
    stock,
    basket: () => {
      let items = [];
      return {
        pickUp: itemName => {
          items.push(itemName);
        },
        checkout: wallet => {
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
        },
      };
    },
  };
}

const meOut = () => new Error("Get out of here!");

module.exports = {
  aShop,
};
