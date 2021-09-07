import Command from "../../Interfaces/Command";
import phin, {IJSONResponse, IStringResponse} from 'phin';
import moment from 'moment';
import fetch from 'node-fetch';

export default class GithubCommand extends Command {
    constructor(client) {
        super(client, 'github', {
            description: "Lookup a users github account.",
            category: "Core",
            options: [
                {
                    type: 3,
                    name: 'username-repository',
                    description: 'The username or repository name. (Or Username/Repository)',
                    required: true
                }
            ]
        });
    }
    async run(interaction, member, options, subOptions) {

        const repo = options.get("username-repository");

        const [username, repository] = repo.split("/");
        if(username && !repository) { //return m message.channel.send("Repository be in the form `username/repository`");
           const { body }: IJSONResponse<any> = (await phin({url: `https://api.github.com/users/${username}`, parse: 'json', method: 'GET'}))
                if(body?.message) return interaction.createFollowup("`🚫` No search results found, maybe try searching for something that exists.");
                const embed = new this.client.embed();
                embed.setTitle(`${body?.login} (${body?.id})`);
                embed.setAuthor("GitHub", "https://i.imgur.com/e4HunUm.png", "https://github.com/");
                embed.setURL(body?.html_url);
                embed.setThumbnail(body?.avatar_url);
                embed.setDescription(`${body?.bio || "No Bio."}\n\n` + [`**❯ ID:** ${body.id}`, `**❯ Name:** ${body?.login}`, `**❯ Location:** ${body?.location || "No location"}`, `**❯ Repositories:** ${body.public_repos > 0 ? body.public_repos : "None"}`, `**❯ Followers:** ${body.followers > 0 ? body.followers : "None"}`, `**❯ Following:** ${body.following > 0 ? body.following : "None"}`, ].join("\n"));
                embed.addField("❯ Account Created", moment.utc(body?.created_at).format("dddd, MMMM, Do YYYY (h:mm:ss)"));
                interaction.createFollowup({
                    embeds: [embed]
                });

            return;
        }
        const { body } = await phin({url: `https://api.github.com/repos/${username}/${repository}`, parse: 'json'}).catch(() => null);
        if(body.status === 404) return interaction.createFollowup("`🚫` No search results found, maybe try searching for something that exists.");
        const b = await body.json();
        const size = b.size <= 1024 ? `${b.size} KB` : Math.floor(b.size / 1024) > 1024 ? `${(b.size / 1024 / 1024).toFixed(2)} GB` : `${(b.size / 1024).toFixed(2)} MB`;
        const license = b.license && b.license.name && b.license.url ? `[${b.license.name}](${b.license.url})` : b.license && b.license.name || "None";
        const embed = new this.client.embed();
        embed.setTitle(b.full_name);
        embed.setAuthor("GitHub", "https://i.imgur.com/e4HunUm.png", "https://github.com/");
        embed.setURL(b.html_url);
        embed.setThumbnail(b.owner.avatar_url);
        embed.setDescription(`${b.description || "No description."}\n\n` + [`**❯ Language:** ${b.language}`, `**❯ License:** ${license}`, `**❯ Size:** ${size}`, `**❯ Stars:** ${b.stargazers_count.toLocaleString() > 0 ? b.stargazers_count.toLocaleString() : "None"}`, `**❯ Forked:** ${b.forks_count.toLocaleString() > 0 ? b.forks_count.toLocaleString() : "None"}`, `**❯ Watchers:** ${b.subscribers_count.toLocaleString() > 0 ? b.subscribers_count.toLocaleString() : "None"}`, `**❯ Open Issues:** ${b.open_issues.toLocaleString() > 0 ? b.open_issues.toLocaleString() : "None"}`].join("\n"));
        if(b.fork) embed.addField("❯ Forked", `[${b.parent.full_name}](${b.parent.html_url})`, true);
        if(b.archived) embed.addField("❯ This repository is Archived", "\u200b", true);
        return interaction.createFollowup({
            embeds: [embed]
        });



    }

}
