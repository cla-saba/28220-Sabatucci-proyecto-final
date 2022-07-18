const MongoDb = require('../../containers/MongoDb');

class ProductsDaoMongoDb extends MongoDb {
  constructor() {
    super('products');
  }
};

module.exports = ProductsDaoMongoDb;
