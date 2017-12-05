// @flow

type ItemNames = string[];
type ItemName<Stock> = $Enum<Stock>;
type Stock = {[name: string]: Item};
type ShopOptions<S: Stock> = {stock: S};

class Shop<S: Stock> {
  stock: S;

  constructor({stock}: ShopOptions<S>) {
    this.stock = stock;
  }

  basket(): Basket<S> {
    return new Basket(this.stock);
  }
}

class Basket<S: Stock> {
  stock: S;
  items: ItemName<S>[];

  constructor(stock: S) {
    this.stock = stock;
    this.items = [];
  }

  pickUp(itemName: ItemName<S>): void {
    this.items.push(itemName);
  }

  checkout(wallet: Wallet): ItemNames {
    const price = this.items
      .map(itemName => this.stock[itemName].price.silver)
      .reduce((a, b) => a + b);
    if (wallet.silver < price) {
      throw meOut();
    }

    wallet.silver -= price;
    for (let itemName of this.items) {
      this.stock[itemName].quantity -= 1;
    }
    const boughtItems = this.items;
    this.items = [];
    return boughtItems;
  }
}

class Item {
  quantity: number;
  price: {silver: number};

  constructor(quantity: number, price: {silver: number}) {
    this.quantity = quantity;
    this.price = price;
  }
}

class Wallet {
  silver: number;

  constructor({silver}: {silver: number}) {
    this.silver = silver;
  }
}

const meOut = () => new Error("Get out of here!");

module.exports = {
  Item,
  Shop,
  Wallet,
};
