import { Event } from '../../Interfaces/Event';
import mongo from '../../Interfaces/Database';
import redisConnect from '../../Interfaces/Redis';
import { Lavalink } from '../../Interfaces/Lavalink';
import { METHODS } from 'http';
import p from 'phin';
import { Message, TextChannel } from 'eris';
import guild from '../../Schemas/Invite Schemas/inviteMember';
import MessageEmbed from '../../Classes/Embeds';
let e;

interface StreamOptions {
  isLive: boolean;
  name: string;
}

export default class ReadyEvent extends Event {
  constructor(client) {
    super(client, 'ready', {
      once: true,
    });
  }

  async run(message: Message) {
    await this.client.manager.init(this.client.user.id);
    e = this.client;
    await mongo();
    this.client.redis = await redisConnect(this.client);
    this.client.logger.info(
      `${this.client.user.username}#${this.client.user.discriminator} has successfully logged in!`
    );

    const nf = new Intl.NumberFormat();

    const activities = {
      get '0'() {
        return `Powering ${nf.format(e.guilds.size)} servers!`;
      },
      get '1'() {
        return `discord.gg/AznMQg5cSA | vade-bot.com`;
      },
      get '2'() {
        return `${nf.format(e.users.size)} users!`;
      },
    };

    let i = 0;
    const commands = [];
    const contextCommands = [];
    await this.client.commands.forEach((command) => {
      if (!command.contextOnly) {
        commands.push({
          options: command.options,
          name: command.name,
          description: command.description,
          defaultPermission: command.devOnly,
        });
      }
    });

    const contextFiltered = this.client.commands.filter(
      (m) => m.contextUserMenu
    );
    await contextFiltered.forEach((command) => {
      commands.push({
        name: this.client.utils.capitalise(command.name),
        defaultPermission: command.devOnly,
        type: command.contextType,
      });
    });
    if (this.client.user.id === this.client.config.CLIENTS.beta) {
      const guild = await this.client.getRESTGuild(
        this.client.config.GUILDS.testing
      );
      guild.bulkEditCommands(commands);
    } else if (this.client.user.id === this.client.config.CLIENTS.main) {
      this.client.bulkEditCommands(commands);
    }

    setInterval(
      () =>
        this.client.editStatus(`online`, {
          type: 5,
          name: `/help | ${activities[i++ % 3]}`,
          url: 'https://vade-bot.com',
        }),
      15000
    );

    const guilds = this.client.guilds.map((x) => x.id);
    const data = [];
    guilds.forEach(async (g) => {
      await this.client.utils.getGuildSchema(g).then((schema) => {
        if(schema) {
          data.push(schema);
        }
      });
    });
    // @ts-ignore
    data.forEach(async (g) => {
      const object = g?.Notifications;
      // @ts-ignore
      if(guildData?.Notifications["twitchChannelName"]) {
        setInterval(async () => {
          // @ts-ignore
          const user = guildData.Notifications["twitchChannelName"];
          // @ts-ignore
          if (!user.isLive && guildData.Notifications.isLive) {
            object['isLive'] = false;
            // @ts-ignore
            await guildData.updateOne({
              Notifications: object,
            });
            return;
          }
          // @ts-ignore
          if (user?.isLive && !guildData.Notifications['isLive']) {
            object['isLive'] = true;
            // @ts-ignore
            await guildData.updateOne({
              Notifications: object,
            });
            const embed = new this.client.embed();
            // @ts-ignore
            const notificationChannelId = guildData.Notifications.notificationChannel;
            const channel = (await this.client.getRESTChannel(notificationChannelId)) as TextChannel;
            embed.setTitle(`${user.username} is live!`);
            embed.setDescription(
                `[${user.username} is currently live playing ${user.game.name}](https://twitch.tv/${user.username})`
            );
            embed.setImage(user.avatar);
            channel.createMessage({
              embeds: [embed],
            });
          }
        });
      }
    });

  }
}
