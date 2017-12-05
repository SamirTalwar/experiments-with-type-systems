const aShop = ({stock}) => ({
  stock,
  basket: () => {
    let items = [];
    return {
      pickUp: itemName => {
        if (!stock[itemName]) {
          throw new Error(`Hey, we don't stock ${itemName}!`);
        }
        items.push(itemName);
      },
      checkout: wallet => {
        const price = items
          .map(itemName => stock[itemName].price.silver)
          .reduce((a, b) => a + b);
        if (!wallet.silver || wallet.silver < price) {
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
});

const meOut = () => new Error("Get out of here!");

module.exports = {
  aShop,
};
