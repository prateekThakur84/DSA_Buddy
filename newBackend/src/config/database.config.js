const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDatabase = async () => {
  try {
    const connectionString = process.env.DB_CONNECT_STRING;
    
    if (!connectionString) {
      throw new Error('Database connection string is not defined in environment variables');
    }

    // const options = {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   maxPoolSize: 10,
    //   serverSelectionTimeoutMS: 5000,
    //   socketTimeoutMS: 45000,
    // };

    await mongoose.connect(connectionString);

    console.log('✅ MongoDB connected successfully');

    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
};

module.exports = connectDatabase;