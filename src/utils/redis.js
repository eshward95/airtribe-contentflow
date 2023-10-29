const { redis } = require("../config");

const DEFAULT_EXPIRATION = 1800; //30 mins

const getOrSetCache = async (key, cb) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await redis.client.get(key); // Use await to get the cache data

      if (data !== null) {
        console.log("cache hit");
        resolve(JSON.parse(data)); // Resolve with the cached data if it exists
      } else {
        console.log("cache miss");
        // console.log(cb);
        const freshData = await cb(); // Fetch the fresh data

        // Store the fresh data in the cache with an expiration time
        await redis.client.setEx(
          key,
          DEFAULT_EXPIRATION,
          JSON.stringify(freshData)
        );

        resolve(freshData); // Resolve with the fresh data
      }
    } catch (err) {
      reject(err); // Reject the promise in case of any errors
    }
  });
};

async function deleteCacheKey(key) {
  redis.client.del(key, (err, reply) => {
    if (err) {
      console.log("Error deleting cache key:", err);
      return;
    }
    console.e(`Cache key "${key}" deleted:`, reply === 1 ? "Yes" : "No");
  });
}

module.exports = { getOrSetCache, deleteCacheKey };
