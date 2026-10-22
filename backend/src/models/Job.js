const mongoose = require('mongoose');
const { isUsingMemory } = require('../config/db');
const { memoryStores } = require('./store');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Job location is required'],
      default: 'Remote'
    },
    type: {
      type: String,
      enum: ['Full-Time', 'Part-Time', 'Remote', 'Contract', 'Internship'],
      default: 'Full-Time'
    },
    salary: {
      type: String,
      default: '$120,000 - $150,000'
    },
    description: {
      type: String,
      required: [true, 'Job description is required']
    },
    requirements: {
      type: [String],
      default: []
    },
    experienceLevel: {
      type: String,
      enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Lead / Staff'],
      default: 'Mid Level'
    },
    category: {
      type: String,
      default: 'Engineering'
    },
    tags: {
      type: [String],
      default: ['React', 'Node.js']
    },
    companyLogo: {
      type: String,
      default: ''
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

let MongooseJobModel;
try {
  MongooseJobModel = mongoose.model('Job');
} catch (e) {
  MongooseJobModel = mongoose.model('Job', jobSchema);
}

const Job = new Proxy(MongooseJobModel, {
  get(target, prop) {
    if (isUsingMemory() && memoryStores.jobs[prop]) {
      return memoryStores.jobs[prop].bind(memoryStores.jobs);
    }
    return target[prop];
  }
});

module.exports = Job;
