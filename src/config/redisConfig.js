const redis = require("redis");
const { config } = require(".");

// Creating the Redis client
const redisClient = redis.createClient({ url: config.redis.host });
const client = redisClient;
redisClient.on("error", (error) => {
  console.error("Redis Error:", error);
});
const connect = async () => {
  await redisClient.connect();
};
redisClient.on("connect", () => console.log("Redis Client Connected"));

module.exports = { connect, client };
