import { Logger } from "@dimensional-fun/logger";
import mongoose from "mongoose";
import config from "../config.json";

export default async function mongo() {
    const logger = new Logger("mongodb");
    try {
       await mongoose.connect(
            config.mongoURI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                keepAlive: true,
            },
            (err) => {
                if (err) return console.log(err.stack || err.message);
            }
        );

        mongoose.connection.on("connect", () => {
            logger.info("Mongoose is connected");
        });

        mongoose.connection.on("error", (err) => {
            logger.error(err.stack || err.message);
        });

        mongoose.connection.on("disconnect", () => {
            logger.info("Mongoose was disconnected");
        });

        mongoose.connection.on("reconnect", () => {
            logger.info("Mongoose has reconnected");
        });
    } catch (e) {
        logger.error(e);
        process.exit(1);
    }
}