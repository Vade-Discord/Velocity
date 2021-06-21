import type { RunFunction } from "../../interfaces/Event";
import type { Bot } from "../../client/Client";


export const run: RunFunction = async (
  client: Bot,
  message
) => {
    if(message.author.bot) return;

   const check = await client.utils.checkModerator(message);
    const prefix = client.config.prefix;
    if(message.content?.toLowerCase().startsWith(prefix)) {

        const args = message.content.slice(prefix.length).trim().split(' ');
        let cmd = args.shift().toLowerCase();

        const command = client.commands.get(cmd?.toLowerCase()) || client.commands.get(client.aliases.get(cmd?.toLowerCase()));
        if(!command) return;

       const check =  await client.utils.runPreconditions(message, command);
       if(check) return;

       try {
           await command.run(message, args);
       } catch (e) {
           let embed = new client.embed()
               .setTitle(`An error has occured!`)
               .setDescription(`\`${e}\``)
           return message.channel.createMessage({ embed: embed, messageReference: { messageID: message.id }});
       }

    }

};

export const name: string = "messageCreate";