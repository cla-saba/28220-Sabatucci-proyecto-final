const FileSystem = require('../../containers/FileSystem');

class CartDaoFileSystem extends FileSystem {
  constructor() {
    super('cart');
  }
};

module.exports = CartDaoFileSystem;