  import { Event } from '../../Interfaces/Event';
  import mongo from '../../Interfaces/Database';

      export default class ReadyEvent extends Event {
          constructor(client) {
              super(client, "ready", {
                 once: true,
              });
          }

          async run() {
              await mongo();
              console.log(`${this.client.user.username}#${this.client.user.discriminator} has successfully logged in!`);

          const guild = this.client.guilds.get("857895083839324190");

              this.client.editStatus('online', { name: "Vade Rewrite", type: 5, url: "https://vade-bot.com"});

           this.client.commands.forEach( (command) => {
               guild.createCommand({
                   options: command.options,
                   name: command.name,
                   description: command.description,
                   defaultPermission: command.devOnly,
               });
          })
          }

      }