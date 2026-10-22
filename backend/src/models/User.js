const mongoose = require('mongoose');
const { isUsingMemory } = require('../config/db');
const { memoryStores } = require('./store');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    role: {
      type: String,
      enum: ['jobseeker', 'recruiter', 'admin'],
      default: 'jobseeker'
    },
    title: {
      type: String,
      default: 'Software Developer'
    },
    bio: {
      type: String,
      default: ''
    },
    skills: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

let MongooseUserModel;
try {
  MongooseUserModel = mongoose.model('User');
} catch (e) {
  MongooseUserModel = mongoose.model('User', userSchema);
}

// Transparent Proxy that routes to real Mongoose when connected or memoryStores when fallback is active
const User = new Proxy(MongooseUserModel, {
  get(target, prop) {
    if (isUsingMemory() && memoryStores.users[prop]) {
      return memoryStores.users[prop].bind(memoryStores.users);
    }
    return target[prop];
  }
});

module.exports = User;
