const Firebase = require('../../containers/Firebase');

class UsersDaoFirebase extends Firebase {
  constructor() {
    super('users');
  }
};

module.exports = UsersDaoFirebase;