const client = require("firebase-admin");
const serviceAccount = require(`../${process.env.FIREBASE_SERVICE_ACCOUNT_KEY}.json`);
const { logFile } = require('../helpers/loggers.js');

client.initializeApp({
  credential: client.credential.cert(serviceAccount)
});

class Firebase {
  constructor(name) {
    this.name = name;
  }

  async _connect() {
    try {
      const db = await client.firestore();
      const collection = await db.collection(this.name);
      return collection;
    } catch (err) {
      logFile.error(err)
    }
  }

  async _disconnect() { }

  async findAll() {
    try {
      const collection = await this._connect();
      const querySnapshot = await collection.get();
      return querySnapshot.docs ? querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) : []
    } catch (err) {
      logFile.error(err);
    } finally {
      await this._disconnect();
    }
  }

  async find(id) {
    try {
      const collection = await this._connect();
      return await collection.doc(id).get();
    } catch (err) {
      logFile.error(err);
    } finally {
      await this._disconnect();
    }
  }

  async findBy(field, value) {
    try {
      const collection = await this._connect();
      const querySnapshot = await collection.where(field, "==", value).get();
      return querySnapshot[0].data();
    } catch (err) {
      logFile.error(err);
    } finally {
      await this._disconnect();
    }
  }

  async create(data) {
    try {
      const collection = await this._connect();
      return await collection.add({ ...data, timestamp: Date.now() });
    } catch (err) {
      logFile.error(err);
    } finally {
      await this._disconnect();
    }
  }

  async update(data, id) {
    try {
      const collection = await this._connect();
      await collection.doc(id).update({ ...data, timestamp: Date.now() });
    } catch (err) {
      logFile.error(err);
    } finally {
      await this._disconnect();
    }
  }

  async remove(id) {
    try {
      const collection = await this._connect();
      await collection.doc(id).delete();
    } catch (err) {
      logFile.error(err);
    } finally {
      await this._disconnect();
    }    
  }

  async removeAll() {
    try {
      const collection = await this._connect();
      const docs = await collection.listDocuments();
      docs.forEach(doc => doc.delete());
    } catch (err) {
      logFile.error(err);
    } finally {
      await this._disconnect();
    }
  }
}


module.exports = Firebase;
