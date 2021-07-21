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


export const expiry = (callback) => {
    const expired = () => {
        const sub = createClient({
            url: redis.redisPath,
        });
        sub.subscribe('__keyevent@0__:expired', () => {
            sub.on("message", (channel, message) => {
                sub(message)
            });
        });

        const pub = createClient({
            url: redis.redisPath,
        });
        pub.send_command('config', ['set', 'notify-keyspace-events', 'Ex'], expired());

    }
}

export default redisConnect;
