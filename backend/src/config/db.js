const mongoose = require('mongoose');

let isConnected = false;
let useMemoryStore = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobportal';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnected = true;
    useMemoryStore = false;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[Database] Could not connect to MongoDB at ${uri} (${error.message}).`);
    console.log(`[Database] Activating integrated in-memory MongoDB-compatible document store.`);
    console.log(`[Database] All APIs, JWT auth, jobs & applications will work seamlessly out-of-the-box!`);
    useMemoryStore = true;
    isConnected = true;
    return null;
  }
};

const isUsingMemory = () => useMemoryStore;

module.exports = {
  connectDB,
  isUsingMemory
};
