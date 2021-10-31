import { Event } from '../../Interfaces/Event';

export default class BanAddEvent extends Event {
    constructor(client) {
        super(client, "guildBanRemove", {

        });
    }

    async run(guild, user) {

        if(!user) return;
        let moderationEmoji = this.client.constants.emojis.moderation.mention;
        let tag = `${user.username}#${user.discriminator}`
        let embed = new this.client.embed()
            .setAuthor(tag, user.avatarURL)
            .setTitle(`${moderationEmoji} User Unbanned`)
            .setDescription(`**User:** ${tag} (${user.id})`)
            .setThumbnail(user.avatarURL)
            .setFooter(`Velocity Logging System`)
            .setColor(`#00C09A`)
            .setTimestamp();

        const logChannel = await this.client.utils.loggingChannel(guild, 'moderation');
        logChannel ? logChannel.createMessage({ embeds: [embed] }) : null;
    }

}