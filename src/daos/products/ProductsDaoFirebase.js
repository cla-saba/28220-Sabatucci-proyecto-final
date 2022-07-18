const Firebase = require('../../containers/Firebase');

class ProductsDaoFirebase extends Firebase {
  constructor() {
    super('products');
  }
};

module.exports = ProductsDaoFirebase;