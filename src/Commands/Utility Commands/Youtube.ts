import Command from "../../Interfaces/Command";
import { YTDate, YTDescription, YTSub, YTVideo, YTView, YTThumbNail } from 'tech-tip-cyber';
export default class YoutubeCommand extends Command {
    constructor(client) {
        super(client, 'youtube', {
            aliases: ["yt", "ytstats"],
            description: "Lookup a YouTube channel!",
            category: "Utility",
        });
    }
    async run(message, args) {

        const channel = args.join(" ");
        if(!channel) return message.channel.createMessage({ content: `You need to specify a channel.`, messageReference: { messageID: message.id }});

        YTDate({ YTChannel: channel }).then(date => {
            YTDescription({ YTChannel: channel }).then(desc => {
                YTSub({ YTChannel: channel }).then(sub => {
                    YTVideo({ YTChannel: channel }).then(video => {
                        YTView({ YTChannel: channel }).then(view => {
                            YTThumbNail({ YTChannel: channel }).then(thum => {
                                const embed = new this.client.embed()
                                    .setAuthor(`${channel} Stats`, thum)
                                    .setTimestamp()
                                    .setThumbnail(thum)
                                    .setColor('RANDOM')
                                    .setDescription(`Description: **${desc.length ? desc : 'No description set.'}**\n\nSubscribers: **${sub}**\nTotal Views: **${view}**\nTotal Videos: **${video}**\nChannel Created: **${new Date(date)}**`)
                                    .setFooter(`Requested By ${message.author.username}`)
                                message.channel.createMessage({ embed: embed, messageReference: { messageID: message.id  }});
                            })
                        })
                    })
                })
            })
        })



     }

    }
