const { createClient } = require('redis');

/**
 * Create and configure Redis client
 */
const redisClient = createClient({
  username: 'default',
  password: process.env.REDIS_PASS,
  socket: {
    host: 'redis-15313.crce179.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 15313,
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error('❌ Redis: Too many reconnection attempts');
        return new Error('Too many retries');
      }
      const delay = Math.min(retries * 50, 2000);
      console.log(`⚠️  Redis: Reconnecting in ${delay}ms...`);
      return delay;
    }
  }
});

// Event handlers
redisClient.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err.message);
});

redisClient.on('reconnecting', () => {
  console.log('⚠️  Redis reconnecting...');
});

redisClient.on('ready', () => {
  console.log('✅ Redis ready to accept commands');
});

module.exports = redisClient;