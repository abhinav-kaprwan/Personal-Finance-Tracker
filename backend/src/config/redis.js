import Redis from "ioredis"
import dotenv from "dotenv";

dotenv.config();

let redisClient = null;

if (process.env.REDIS_URL) {
  try {
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      connectTimeout: 10000,
      commandTimeout: 5000,
      enableReadyCheck: true,
      enableOfflineQueue: false,
      retryStrategy(times) {
        if (times > 3) {
          console.log("Redis max retries reached, disabling Redis");
          return null;
        }
        const delay = Math.min(times * 200, 2000);
        return delay;
      },
      tls: {
        rejectUnauthorized: false
      },
      family: 4,
    });

    redisClient.on("connect", () => {
      console.log("Redis connected successfully");
    });

    redisClient.on("ready", () => {
      console.log("Redis is ready to accept commands");
    });

    redisClient.on("error", (err) => {
      console.error("Redis error:", err.message);
    });

    redisClient.on("close", () => {
      console.log("Redis connection closed");
    });

  } catch (error) {
    console.error("Failed to initialize Redis:", error.message);
    redisClient = null;
  }
} else {
  console.log("Redis disabled (REDIS_URL not set)");
}

export default redisClient;