import Command from "../../Interfaces/Command";
import guild_schema from "../../Schemas/Main Guilds/GuildSchema";

export default class PrefixCommand extends Command {
    constructor(client) {
        super(client, 'prefix', {
            description: "Change the bot prefix.",
            category: "Moderation",
            modCommand: true,
            userPerms: ['banMembers'],
            //botPerms: ['banMembers'],
            guildOnly: true,
        });
    }
    async run(message, args) {

        let GuildConfig = await guild_schema.findOne({
            guildID: message.channel.guild.id,
        });
        if (!GuildConfig) {
            GuildConfig = await this.client.utils.createGuildSchema(message.channel.guild)
        }
        if (!args.length)
            return message.channel.createMessage(
                `The current prefix for this Guild is \`${
                    (GuildConfig as any)?.prefix || "!"
                }\``
            );

        if (message.mentionEveryone || message.mentions.length >= 1)
            return message.channel.createMessage(`Your prefix cannot contain a mention.`);

        if (args[0].length > 4)
            return message.channel.createMessage(`The max length for Prefixes is 4 characters.`);

        await guild_schema.updateOne({
            guildID: message.channel.guild.id,
            prefix: args[0].toLowerCase(),
        });
        // @ts-ignore
        await this.client.redis.set(`prefix.${message.channel.guild.id}`, args[0].toLowerCase(), 'EX', 1800);
        return message.channel.createMessage(
            `Successfully updated your prefix. It is now \`${args[0].toLowerCase()}\``
        );

    }

}
