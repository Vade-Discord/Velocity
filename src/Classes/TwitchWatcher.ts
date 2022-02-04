import phin from 'phin';
import { Bot } from "../Client/Client";

const CHANNEL_ENDPOINT = (username: string) => `https://api.twitch.tv/helix/search/channels?query=${username}&first=1`;

export default class TwitchWatcher {
    public constructor(public client: Bot) {}



    public async getTwitchUser(username: string): Promise<TwitchUser | null> {
        const res = await phin<TwitchUserResponse>({
            url: CHANNEL_ENDPOINT(username),
            method: 'GET',
            headers: {
                'Client-ID': this.twitchClient.id,
                'Authorization': `Bearer ${this.twitchClient.secret}`
            },
            parse: 'json'
        });

        const [user] = res.body.data;
        if (!user) return null;

        return {
            id: user.id,
            username: user.display_name,
            avatar: user.thumbnail_url,
            isLive: user.is_live,
            title: user.title,
            game: {
                id: user.game_id,
                name: user.game_name
            },
            startedAt: user.started_at ? new Date(user.started_at) : null,
        }
    }

   public get twitchClient() {
       return {
           id: this.client.config.TWITCH.Client_ID,
           secret: this.client.config.TWITCH.Client_Secret
       }
   }
}

export interface TwitchUserResponse {
    data: TwitchUserObjectResponse[];
}

export interface TwitchUserObjectResponse {
    broadcaster_login: string;
    display_name: string;
    game_id: string;
    game_name: string;
    id: string;
    is_live: boolean;
    thumbnail_url: string;
    title: string;
    started_at: string;
}

export interface TwitchUser {
    id: string;
    username: string;
    avatar: string;
    isLive: boolean;
    title: string;
    game: {
        id: string;
        name: string;
    },
    startedAt: Date | null;
}