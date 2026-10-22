const mongoose = require('mongoose');
const { isUsingMemory } = require('../config/db');
const { memoryStores } = require('./store');

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required']
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Shortlisted', 'Interviewing', 'Accepted', 'Rejected'],
      default: 'Submitted'
    },
    coverNote: {
      type: String,
      default: ''
    },
    resumeUrl: {
      type: String,
      default: ''
    },
    portfolioUrl: {
      type: String,
      default: ''
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

let MongooseAppModel;
try {
  MongooseAppModel = mongoose.model('Application');
} catch (e) {
  MongooseAppModel = mongoose.model('Application', applicationSchema);
}

const Application = new Proxy(MongooseAppModel, {
  get(target, prop) {
    if (isUsingMemory() && memoryStores.applications[prop]) {
      return memoryStores.applications[prop].bind(memoryStores.applications);
    }
    return target[prop];
  }
});

module.exports = Application;
