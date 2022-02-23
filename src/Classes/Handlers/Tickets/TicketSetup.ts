import { Constants, Member } from 'eris';
import Tickets from './Ticket';

export default class TicketSetup extends Tickets {
  public async run(member: Member, interaction) {
    const category = await member.guild.createChannel('Tickets', 4);
    const channel = await member.guild.createChannel('tickets', 0, {
      parentID: category.id
    });
    const embed = new this.client.embed();
    embed.setDescription('Click the button below to create a new ticket');
    embed.setTitle('Create A New Ticket');
    embed.setThumbnail(member.guild.iconURL);

    channel.editPermission(member.guild.id, 0, 2048, Constants.PermissionOverwriteTypes.ROLE);

    return channel.createMessage({embeds: [embed], components: [{
      type: 1,
      components: [
        {
          type: 2,
          style: 3,
          label: 'Create Ticket',
          custom_id: 'ticket-setup#new',
        }
      ]
    }]});
  }
}