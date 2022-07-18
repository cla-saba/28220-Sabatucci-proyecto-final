const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const { logFile } = require('../helpers/loggers.js');

class MongoDb {
  constructor(name) {
    this.name = name;
    this.client = new MongoClient(
      process.env.MONGODB_URI,
      { useUnifiedTopology: true }
    )
  }

  async _connect() {
    try {
      await this.client.connect();
      const db = await this.client.db(process.env.MONGODB_DB);
      const collection = await db.collection(this.name);
      return collection;
    } catch (err) {
      logFile.error(err)
    }
  }

  async _disconnect() {
    try {
      await this.client.close();
    } catch (err) {
      logFile.error(err)
    }
  }

  async findAll() {
    try {
      const collection = await this._connect();
      return await collection.find().toArray();
    } catch (err) {
      logFile.error(err);
    } finally {
      await this._disconnect();
    }
  }

  async find(id) {
    try {
      const collection = await this._connect();
      const record = await collection.findOne({ _id: ObjectId(id) });
      // if (!record) return { error: 'Registro no encontrado' };
      return record;
    } catch (err) {
      logFile.error(err);
    } finally {
      await this._disconnect();
    }
  }

  async findBy(field, value) {
    try {
      const collection = await this._connect();
      const record = await collection.findOne({ [field]: value });
      // if (!record) return { error: 'Registro no encontrado' };
      return record;
    } catch (err) {
      logFile.error(err);
    } finally {
      await this._disconnect();
    }
  }

  async create(data) {
    try {
      const collection = await this._connect();
      const record = await collection.insertOne({ ...data, timestamp: Date.now() });
      const cartId = await this.find(record.insertedId.toString());
      return cartId;
    } catch (err) {
      logFile.error(err);
    } finally {
      await this._disconnect();
    }
  }

  async update(data, id) {
    try {
      const collection = await this._connect();
      await collection.findOneAndUpdate(
        { _id: ObjectId(id) },
        { $set: { ...data, timestamp: Date.now() } },
        { upsert: false },
      )
    } catch (err) {
      logFile.error(err);
    } finally {
      await this._disconnect();
    }
  }

  async remove(id) {
    try {
      const collection = await this._connect();
      await collection.deleteOne({ _id: ObjectId(id) });
    } catch (err) {
      logFile.error(err);
    } finally {
      await this._disconnect();
    }
  }

  async removeAll() {
    try {
      const collection = await this._connect();
      await collection.deleteMany();
    } catch (err) {
      logFile.error(err);
    } finally {
      await this._disconnect();
    }
  }
}

module.exports = MongoDb;
