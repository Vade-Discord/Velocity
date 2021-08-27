import Redis from "ioredis";
import { redis } from "../config.json";

const redisConnect = async (c): Promise<Redis> => {
    return new Promise((resolve, reject) => {
        const client = new Redis(redis.port, redis.redisPath);

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
