import Redis from "ioredis"
import dotenv from "dotenv";

dotenv.config();

let redisClient = null;

if (process.env.NODE_ENV === "production") {
  redisClient = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
  });

  redisClient.on("connect", () => {
    console.log("Redis connected");
  });

  redisClient.on("error", (err) => {
    console.error("Redis error", err);
  });
} else {
  console.log("Redis disabled in development");
}

export default redisClient;