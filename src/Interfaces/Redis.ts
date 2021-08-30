import Redis from "ioredis";
import { redis } from "../config.json";
import { Logger } from "@dimensional-fun/logger";
import { Bot } from "../Client/Client";

const logger: Logger = new Logger("cache");
const redisConnect = async (client: Bot): Promise<Redis> => {
    return new Promise((resolve, reject) => {
        const publisher = new Redis(redis.port, redis.redisPath);
        const subscriber = new Redis(redis.port, redis.redisPath);

        subscriber.subscribe('__keyevent@0__:expired')

        publisher.on("error", (err) => {
            logger.error(`(Publisher) Redis encountered an error: `, err);
            publisher.quit();
            reject(err);
        });

        publisher.on("ready", () => {
            resolve(publisher);
            logger.info(`(Publisher) Redis has successfully connected.`);
        });
        
        subscriber.on("error", (err) => {
            logger.error("(Subscriber) Redis encountered an error:", err)
            subscriber.quit()
            reject(err)
        })
        
        subscriber.on("ready", () => {
            logger.info("(Subscriber) Redis has successfully connected.")
        })

        subscriber.on('message', (channel, key) => {
            switch (channel) {
                case '__keyevent@0__:expired':
                    client.emit("keyExpired", key);
                    break;
            }
        })

    });
};

export default redisConnect;
