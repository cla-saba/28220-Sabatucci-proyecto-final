const { logFile } = require('../helpers/loggers.js');

class Memory {
  constructor() {
    this.id = 0;
    this.records = [];
  };

  async findAll() {
    try {
      return [...this.records] || [];
    } catch (err) {
      logFile.error(err);
    }
  };

  async find(id) {
    try {
      const record = this.records.find(r => r.id == id);
      // if (!record) return { error: 'Registro no encontrado' };
      return record;
    } catch (err) {
      logFile.error(err);
    }
  };

  async findBy(field, value) {
    try {
      const record = this.records.find(r => r[field] == value);
      // if (!record) return { error: 'Registro no encontrado' };
      return record;
    }
    catch (err) {
      logFile.error(err);
    }
  }

  async create(data) {
    try {
      const newRecord = { ...data, id: ++this.id, timestamp: Date.now() }
      this.records.push(newRecord);
      return newRecord;
    } catch (err) {
      logFile.error(err);
    }
  };

  async update(data, id) {
    try {
      const newRecord = { id: Number(id), ...data, timestamp: Date.now() };
      const index = this.records.findIndex(r => r.id == id);
      if (index == -1) return { error: 'Registro no encontrado' };
      this.records[index] = newRecord;
    } catch (err) {
      logFile.error(err);
    }
  };

  async remove(id) {
    try {
      const index = this.records.findIndex(r => r.id == id);
      if (index == -1) return { error: 'Registro no encontrado' };
      this.records.splice(index, 1);
    } catch (err) {
      logFile.error(err);
    }
  }

  async removeAll() {
    try {
      this.records = [];
    } catch (err) {
      logFile.error(err);
    }
  }
};

module.exports = Memory;