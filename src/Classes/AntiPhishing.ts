import { Message } from "eris";
import { Bot } from "../Client/Client";
import phin from "phin";
import AutoModFile from "./AutoMod";

interface result {
    link: string;
    status: boolean;
}

interface match {
    domain: string;
    source: string;
    traversed: boolean;
    acccuracy: number;
}

export default async function AntiPhishing(client: Bot, message: Message,): Promise<result> {
const API_KEY = client.config.API.PHISHING;
const content = message?.content;
const regex = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/;
if(content.match(regex)) {
    const response = await phin<{ match: boolean, matches: match[] }>( {
       url: "https://phishing.t3ned.dev/api/v1/check",
        parse: "json",
        headers: {
            "authorization": `Bearer ${API_KEY}`,
        },
        data: {
            "content": `${content}`,
        }
    });
    if(response?.body.match) {
    message.delete("Detected Phishing Link").catch(() => null);
    return {
        status: true,
        link: response.body.matches[0].domain
    };
    }
} else {
    return {
        status: false,
        link: null,
    };
}



}