import { Member, TextChannel } from 'eris';
import {Constants} from 'eris';
import Tickets from './Ticket';

export default class TicketInternals extends Tickets {
  public async run(member: Member, channel: TextChannel): Promise<TextChannel> {
    const guildDb = await this.client.utils.getGuildSchema(channel.guild.id);
    const logChannelId = guildDb.Logging.ticket;
    const logChannel = channel.guild.channels.get(logChannelId) as TextChannel;
    const embedLog = new this.client.embed();
    const lapsedTime = Date.now();
    const currentTime = new Date(lapsedTime).toLocaleTimeString();
    embedLog.setTitle('Ticket Opened');
    embedLog.setDescription([
      `**Ticket Opened By:** ${member.username}`,
      `**Ticket Channel:** <#${channel.id}>`,
      `**Opened At**: ${currentTime}`
    ].join('\n'),

    );
    logChannel.createMessage({ embeds: [embedLog]});
    const ticketChannel = await member.guild.createChannel(`ticket-${member.username}`, 0, {
      parentID: channel.parentID
    });
    
    ticketChannel.editPermission(member.guild.id, 0, 1024, Constants.PermissionOverwriteTypes.ROLE);
    ticketChannel.editPermission(member.id, 117824, 0, Constants.PermissionOverwriteTypes.USER);
    const embed = new this.client.embed();
    embed.setTitle('New Ticket Created');
    embed.setDescription(`<@${member.id}> created a new ticket`);
    
    let msg = ticketChannel.createMessage({embeds: [embed], components: [{
      type: 1,
      components: [
        {
          type: 2,
          style: 1,
          label: 'Close',
          custom_id: 'closeTicket',
        }
      ]
    }]});
    ticketChannel.pinMessage((await msg).id);
    return ticketChannel;
  }
  public async delete(member: Member, channel: TextChannel) {
    const guildDb = await this.client.utils.getGuildSchema(channel.guild.id);
    const logChannelId = guildDb.Logging.ticket;
    const logChannel = channel.guild.channels.get(logChannelId) as TextChannel;
    const embed = new this.client.embed();
    const lapsedTime = Date.now();
    const currentTime = new Date(lapsedTime).toLocaleTimeString();
    embed.setTitle('Ticket Deletion');
    embed.setDescription([
      `**Ticket Closed By:** ${member.username}`,
      `**Ticket Channel:** ${channel.name}`,
      `**Closed At**: ${currentTime}`
    ].join('\n'),

    );
    channel.delete('Ticket closed!');

    return logChannel.createMessage({ embeds: [embed]});  
  }

}

 