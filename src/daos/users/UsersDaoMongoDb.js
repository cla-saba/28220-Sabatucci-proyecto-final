const MongoDb = require('../../containers/MongoDb');

class UsersDaoMongoDb extends MongoDb {
  constructor() {
    super('users');
  }
};

module.exports = UsersDaoMongoDb;
