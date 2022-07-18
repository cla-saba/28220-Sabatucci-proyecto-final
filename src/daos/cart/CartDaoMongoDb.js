const MongoDb = require('../../containers/MongoDb');

class CartDaoMongoDb extends MongoDb {
  constructor() {
    super('cart');
  }
};

module.exports = CartDaoMongoDb;
