const FileSystem = require('../../containers/FileSystem');

class UsersDaoFileSystem extends FileSystem {
  constructor() {
    super('users');
  }
};

module.exports = UsersDaoFileSystem;