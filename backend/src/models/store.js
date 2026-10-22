// In-memory document collection supporting MongoDB-style query interfaces
const crypto = require('crypto');

class MemoryCollection {
  constructor(name) {
    this.name = name;
    this.documents = [];
  }

  generateId() {
    return crypto.randomBytes(12).toString('hex');
  }

  async create(doc) {
    const newDoc = {
      _id: doc._id || this.generateId(),
      ...doc,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.documents.push(newDoc);
    return JSON.parse(JSON.stringify(newDoc));
  }

  async insertMany(docs) {
    const inserted = [];
    for (const doc of docs) {
      const saved = await this.create(doc);
      inserted.push(saved);
    }
    return inserted;
  }

  _matches(doc, query = {}) {
    for (const key of Object.keys(query)) {
      if (key === '$or') {
        const matchesAny = query.$or.some(subQuery => this._matches(doc, subQuery));
        if (!matchesAny) return false;
        continue;
      }

      const qVal = query[key];
      const dVal = doc[key];

      if (qVal && typeof qVal === 'object' && !(qVal instanceof Date)) {
        if (qVal.$regex) {
          const regex = new RegExp(qVal.$regex, qVal.$options || '');
          if (!regex.test(dVal || '')) return false;
        } else if (qVal.$in) {
          if (!qVal.$in.includes(dVal)) return false;
        } else if (qVal.$ne) {
          if (dVal === qVal.$ne) return false;
        }
      } else {
        if (String(dVal) !== String(qVal)) {
          return false;
        }
      }
    }
    return true;
  }

  _createQueryResult(docs, populatedFields = [], excludedFields = []) {
    let result = docs.map(d => JSON.parse(JSON.stringify(d)));

    const chainable = {
      populate: (field, selectFields) => {
        result = result.map(doc => {
          if (field === 'jobId' || field === 'job') {
            const job = memoryStores.jobs.documents.find(j => String(j._id) === String(doc.jobId || (doc.job && doc.job._id)));
            if (job) {
              doc.jobId = JSON.parse(JSON.stringify(job));
            }
          }
          if (field === 'userId' || field === 'user') {
            const user = memoryStores.users.documents.find(u => String(u._id) === String(doc.userId || (doc.user && doc.user._id)));
            if (user) {
              const uCopy = { ...user };
              delete uCopy.password;
              doc.userId = uCopy;
            }
          }
          return doc;
        });
        return chainable;
      },
      select: (fieldsStr) => {
        if (!fieldsStr) return chainable;
        const fields = fieldsStr.split(' ');
        const removes = fields.filter(f => f.startsWith('-')).map(f => f.slice(1));
        const keeps = fields.filter(f => !f.startsWith('-') && f.length > 0);

        result = result.map(doc => {
          if (removes.length > 0) {
            removes.forEach(f => delete doc[f]);
          } else if (keeps.length > 0) {
            const trimmed = { _id: doc._id };
            keeps.forEach(f => {
              if (doc[f] !== undefined) trimmed[f] = doc[f];
            });
            return trimmed;
          }
          return doc;
        });
        return chainable;
      },
      sort: (sortObj) => {
        const [key, dir] = Object.entries(sortObj)[0] || ['createdAt', -1];
        result.sort((a, b) => {
          const valA = a[key];
          const valB = b[key];
          if (valA < valB) return dir === -1 ? 1 : -1;
          if (valA > valB) return dir === -1 ? -1 : 1;
          return 0;
        });
        return chainable;
      },
      then: (resolve, reject) => {
        return Promise.resolve(result).then(resolve, reject);
      },
      exec: async () => result
    };

    return chainable;
  }

  find(query = {}) {
    const matched = this.documents.filter(doc => this._matches(doc, query));
    return this._createQueryResult(matched);
  }

  async findOne(query = {}) {
    const doc = this.documents.find(d => this._matches(d, query));
    if (!doc) return null;
    return JSON.parse(JSON.stringify(doc));
  }

  async findById(id) {
    const doc = this.documents.find(d => String(d._id) === String(id));
    if (!doc) return null;
    return JSON.parse(JSON.stringify(doc));
  }

  async findByIdAndUpdate(id, update, options = { new: true }) {
    const index = this.documents.findIndex(d => String(d._id) === String(id));
    if (index === -1) return null;
    const existing = this.documents[index];
    const updated = {
      ...existing,
      ...update,
      updatedAt: new Date()
    };
    this.documents[index] = updated;
    return JSON.parse(JSON.stringify(updated));
  }

  async deleteMany(query = {}) {
    const initialCount = this.documents.length;
    if (Object.keys(query).length === 0) {
      this.documents = [];
      return { deletedCount: initialCount };
    }
    this.documents = this.documents.filter(doc => !this._matches(doc, query));
    return { deletedCount: initialCount - this.documents.length };
  }

  async countDocuments(query = {}) {
    return this.documents.filter(doc => this._matches(doc, query)).length;
  }
}

const memoryStores = {
  users: new MemoryCollection('users'),
  jobs: new MemoryCollection('jobs'),
  applications: new MemoryCollection('applications')
};

module.exports = {
  memoryStores
};
