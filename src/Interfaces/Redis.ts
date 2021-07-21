import { createClient, RedisClient } from "redis";
import { redis } from "../config.json";

const redisConnect = async (): Promise<RedisClient> => {
    return new Promise((resolve, reject) => {
        const client = createClient({
            url: redis.redisPath,
        });

        client.on("error", (err) => {
            console.error(`Redis error: `, err);
            client.quit();
            reject(err);
        });

        client.on("ready", () => {
            resolve(client);
            console.log(`Redis has connected`);
        });
    });
};

export default redisConnect;