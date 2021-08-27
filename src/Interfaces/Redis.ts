import Redis from "ioredis";
import { redis } from "../config.json";
import { Logger } from "@dimensional-fun/logger";

const logger: Logger = new Logger("cache");
const redisConnect = async (c): Promise<Redis> => {
    return new Promise((resolve, reject) => {
        const client = new Redis(redis.port, redis.redisPath);

        client.on("error", (err) => {
            logger.error(`Redis encountered an error: `, err);
            client.quit();
            reject(err);
        });

        client.on("ready", () => {
            resolve(client);
            logger.info(`Redis has successfully connected.`);
        });

    });
};

export default redisConnect;
