import Command from "../../Interfaces/Command";
import phin from 'phin';

export default class AnimalCommand extends Command {
    constructor(client) {
        super(client, 'animal', {
            description: "Recieve an image of the specified animal.",
            category: "Fun",
            options: [
                {
                    type: 1,
                    name: 'panda',
                    description: 'An image of a panda.'
                },
                {
                    type: 1,
                    name: 'koala',
                    description: 'An image of a koala.'
                },
                {
                    type: 1,
                    name: 'fox',
                    description: 'An image of a fox.'
                },
                {
                    type: 1,
                    name: 'dog',
                    description: 'An image of a dog.'
                },
                {
                    type: 1,
                    name: 'cat',
                    description: 'An image of a cat.'
                },
                {
                    type: 1,
                    name: 'kangaroo',
                    description: 'An image of a kangaroo.'
                },
                {
                    type: 1,
                    name: 'racoon',
                    description: 'An image of a racoon.'
                },
                {
                    type: 1,
                    name: 'red-panda',
                    description: 'An image of a red-panda.'
                },
                {
                    type: 1,
                    name: 'whale',
                    description: 'An image of a whale.'
                },
                {
                    type: 1,
                    name: 'duck',
                    description: 'An image of a whale.'
                }
            ]
        });
    }
    async run(interaction, member) {

        const embed = new this.client.embed()
            .setColor(this.client.constants.colours.green)
            .setTimestamp()
            .setFooter(`Vade Images`, this.client.user.avatarURL)


        try {


            switch (interaction.data.options[0].name) {

                case "cat": {

                    let {body} = await phin<{ url: string }>({
                        url: "https://api.thecatapi.com/v1/images/search",
                        parse: "json",
                    });
                    embed
                        .setImage(body.url)
                        .setDescription(`[Click To View](${body.url})`);

                    interaction.createFollowup({embeds: [embed]});

                    break;
                }

                case "dog": {

                    let {body} = await phin<{ url: string }>({
                        url: "https://random.dog/woof.json",
                        parse: "json",
                    });

                    embed
                        .setImage(body.url)
                        .setDescription(`[Click To View](${body.url})`);

                    interaction.createFollowup({embeds: [embed]});

                    break;
                }

                case "fox": {

                    let {body} = await phin<{ image: string }>({
                        url: "https://randomfox.ca/floof/",
                        parse: "json",
                    });

                    embed
                        .setImage(body.image)
                        .setDescription(`[Click To View](${body.image})`);

                    interaction.createFollowup({embeds: [embed]});

                    break;
                }

                case "whale": {

                    let {body} = await phin<{ link: string }>({
                        url: "https://some-random-api.ml/img/whale",
                        parse: "json",
                    });

                    embed
                        .setImage(body.link)
                        .setDescription(`[Click To View](${body.link})`);

                    interaction.createFollowup({embeds: [embed]});

                    break;
                }

                case "kangaroo": {

                    let {body} = await phin<{ image: string }>({
                        url: "https://some-random-api.ml/animal/kangaroo",
                        parse: "json",
                    });

                    embed
                        .setImage(body.image)
                        .setDescription(`[Click To View](${body.image})`);

                    interaction.createFollowup({embeds: [embed]});

                    break;
                }

                case "koala": {

                    let {body} = await phin<{ link: string }>({
                        url: "https://some-random-api.ml/img/koala",
                        parse: "json",
                    });


                    embed
                        .setImage(body.link)
                        .setDescription(`[Click To View](${body.link})`);

                    interaction.createFollowup({embeds: [embed]});

                    break;
                }

                case "duck": {

                    let {body} = await phin<{ url: string }>({
                        url: "https://random-d.uk/api/v1/random?type=gif,png",
                        parse: "json",
                    });

                    embed
                        .setImage(body.url)
                        .setDescription(`[Click To View](${body.url})`);

                    interaction.createFollowup({embeds: [embed]});

                    break;
                }
                default: {
                    return;
                }
            }

        } catch (e) {
            return interaction.createFollowup(`Looks like an error occurred... please try again.`);
        }

    }

}
