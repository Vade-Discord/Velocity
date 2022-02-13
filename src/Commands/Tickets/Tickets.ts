import { CommandInteraction, Constants, GuildChannel, Member } from 'eris';
import Command from '../../Interfaces/Command';


export default class TwitchSetupCommand extends Command {
  constructor(client) {
    super(client, 'tickets', {
      aliases: [''],
      description: 'Manage Ticket',
      category: 'Tickets',
      guildOnly: true,
      modCommand: true,
      options: [
        {
          type: 1,
          name: 'add',
          description: 'Add user to ticket',
          options: [
            {
              type: 6,
              name: 'user',
              description: 'The user you would like to add to the ticket',
              required: true,
            },
          ]
        },
        {
          type: 1,
          name: 'remove',
          description: 'Remove a user from the ticket',
          options: [
            {
              type: 6,
              name: 'user',
              description: 'The user you would like to add to the ticket',
              required: true,
            },
          ]
        }
                
      ],
    });
  }
  async run(interaction: CommandInteraction, member: Member, options, subOptions) {

    
    switch(interaction.data.options[0].name) {
    case 'add' : {
      const ticketChannel = interaction.channel as GuildChannel;

      if(!ticketChannel.name.includes('ticket')) return interaction.createMessage({ content: 'This is not a ticket channel', flags: 64});
      if(ticketChannel.permissionOverwrites.map(x => x.id).includes(subOptions.get('user'))) return interaction.createMessage({ content: 'This user is already in the ticket!', flags: 64});

      ticketChannel.editPermission(subOptions.get('user'), 117824, 0, Constants.PermissionOverwriteTypes.USER);

      interaction.channel.createMessage({ content: `Successfully added <@${subOptions.get('user')}> to the ticket!`});
      return;
      break;
    }

    case 'remove': {

      const ticketChannel = interaction.channel as GuildChannel;

      if(!ticketChannel.name.includes('ticket')) return interaction.createMessage({ content: 'This is not a ticket channel', flags: 64});
      const ticketPermission = ticketChannel.permissionOverwrites.map(x => x.id);
      if(!ticketPermission.includes(subOptions.get('user'))) return interaction.createMessage({ content: 'This user is not in the ticket!', flags: 64});
      ticketChannel.deletePermission(ticketPermission.find(x => x === subOptions.get('user')));

      interaction.channel.createMessage({ content: `Successfully removed <@${subOptions.get('user')}> from the ticket!`});
      return;
      break;
    }
    default: {
      return;
    }
    }

  }

}
