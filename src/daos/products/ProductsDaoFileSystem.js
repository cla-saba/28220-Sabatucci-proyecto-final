const FileSystem = require('../../containers/FileSystem');

class ProductsDaoFileSystem extends FileSystem {
  constructor() {
    super('products');
  }
};

module.exports = ProductsDaoFileSystem;