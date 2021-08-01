export interface Config {
    token: string;
    mongoURI: string;
    MAIN_GUILD: string;
    PREMIUM_ROLE: string;
    redisPath: string;
    TOPGG_TOKEN: string;
    TOPGG_AUTH: string;
    LAVA_HOST: string;
    LAVA_PASSWORD: string;
    LAVA_PORT: number;
    SPOTIFY_CLIENT_ID: string;
    SPOTIFY_SECRET_ID: string;
    DEFAULT_VOLUME: number;
    validTypes: string[];
    validGames: string[];
    supportedLang: string[];
}