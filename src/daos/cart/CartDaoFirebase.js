const Firebase = require('../../containers/Firebase');

class CartDaoFirebase extends Firebase {
  constructor() {
    super('cart');
  }
};

module.exports = CartDaoFirebase;