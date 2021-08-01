  import { Event } from '../../Interfaces/Event';

      export default class ReadyEvent extends Event {
          constructor(client) {
              super(client, "ready", {
                 once: true,
              });
          }

          async run() {
          console.log(`${this.client.user.username}#${this.client.user.discriminator} has successfully logged in!`);

          const guild = this.client.guilds.get("857895083839324190");

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