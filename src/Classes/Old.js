'use strict';

import { isGeneratorFunction } from 'util/types';
import constants from '../Interfaces/Constants';

/**
 * @typedef {import('eris').EmbedBase} EmbedBase
 * @typedef {import('eris').Message} Message
 * @typedef {Object} PaginationOptions An optional options object for overwriting defaults
 * @property {Boolean} [showPageNumbers] Whether or not to show the current page index over the embed. Defaults to: true
 * @property {Boolean} [extendedButtons] Whether or not to show extended control buttons besides standard pagination (First & Last page, deleting)
 * @property {Boolean} [cycling] Cycle through all embeds jumping from the first page to the last page on going back and from the last page to the first page going forth. Defaults to: false
 * @property {Number} [maxMatches] How often the reaction handler should listen for a reaction (How often the paginator can be used). Defaults to: 50. Maximum: 100
 * @property {Number} [timeout] How long the paginator should work before the reaction listener times out. Defaults to: 300000ms (5 minutes). Maximum: 900000ms (15 minutes)
 * @property {String} [deleteButton] Emoji which should be used as the delete button. This MUST be a unicode emoji! Defaults to: 🗑
 * @property {String} [firstButton] Emoji which should be used as the first page button. This MUST be a unicode emoji! Defaults to: ⏮
 * @property {String} [lastButton] Emoji which should be used as the last page button. This MUST be a unicode emoji! Defaults to: ⏭
 * @property {String} [backButton] Emoji which should be used as the back button. This MUST be a unicode emoji! Defaults to: ⬅
 * @property {String} [forthButton] Emoji which should be used as the forth button. This MUST be a unicode emoji! Defaults to: ➡
 * @property {Number} [startPage] Which page of the submitted embed array should be shown first. Defaults to: 1 (The 1st page / element in the array)
 */
/**
 * Embed Pagination class
 * @class PaginationEmbed
 * @classdesc Handles the creation, listening and updating of paginated Rich Embeds
 */
class PaginationEmbed {
    /**
     * Constructor for the Embed Paginator
     * @param {Message} message A message object emitted from a messageCreate event coming from Eris, used as an invoker. If sent by the client, the message will be edited.
     * @param {EmbedBase[]} pages An array containing all embed objects
     * @param {PaginationOptions} [options] An optional options object for overwriting defaults
     */
    constructor(message, pages = [], options = {}) {
        this.pages       = pages;
        this.invoker     = message;
        this.options     = options;
        this.cmdname     = options.commandName;
        this.delete      = options.deleteButton  || constants.emojis.trash.id;
        this.firstPage   = options.firstButton   || '⏮';
        this.lastPage    = options.lastButton    || '⏭';
        this.back        = options.backButton    || constants.emojis.arrow_left.id;
        this.forth       = options.forthButton   || constants.emojis.arrow_right.id;
        this.page        = options.startPage     || 1;
        this.cycling     = options.cycling       || true
        this.showPages   = (typeof options.showPageNumbers !== 'undefined') ? options.showPageNumbers : true;
        this.advanced    = (typeof options.extendedButtons !== 'undefined') ? options.extendedButtons : false;
    }

    /**
     * Runs a set of initialization checks, sets up the reaction listener for continuous listening and displays the initial Embed
     * @async
     */
    async initialize() {
        if (this.pages.length < 2) {
            return Promise.reject(new Error('A Pagination Embed must contain at least 2 pages!'));
        }

        if (this.page < 1 || this.page > this.pages.length) {
            return Promise.reject(new Error(`Invalid start page! Must be between 1 (first) and ${this.pages.length} (last)`));
        }

        let components

        if (this.advanced) {
            //await this.message.addReaction(this.firstPage);
            //await this.message.addReaction(this.back);
            //await this.message.addReaction(this.forth);
            //await this.message.addReaction(this.lastPage);
            //await this.message.addReaction(this.delete);
            components = [{
                type: 1,
                components: [{
                    custom_id: `pagination#first`,
                    emoji: {id: this.back},
                    disabled: false,
                    style: 2,
                    type: 2,
                }, {
                    custom_id: `pagination#back`,
                    emoji: {id: this.back},
                    disabled: false,
                    style: 1,
                    type: 2,
                }, {
                    custom_id: `pagination#forth`,
                    emoji: {id: this.forth},
                    disabled: false,
                    style: 1,
                    type: 2,
                },{
                    custom_id: `pagination#last`,
                    emoji: {id: this.forth},
                    disabled: false,
                    style: 2,
                    type: 2,
                },{
                    custom_id: `pagination#delete`,
                    emoji: {id: this.delete},
                    disabled: false,
                    style: 4,
                    type: 2,
                }]
            }]
        } else {
            //await this.message.addReaction(this.back);
            //await this.message.addReaction(this.forth);
            components = [{
                type: 1,
                components: [{
                    custom_id: `pagination#back`,
                    emoji: {id: this.back},
                    disabled: false,
                    style: 1,
                    type: 2,
                }, {
                    custom_id: `pagination#forth`,
                    emoji: {id: this.forth},
                    disabled: false,
                    style: 1,
                    type: 2,
                }]
            }]
        }

        const messageContent = {
            content: (this.showPages) ? `Page **${this.page}** of **${this.pages.length}**` : undefined,
            embed: this.pages[this.page - 1],
            components: components
        }

        if (this.invoker.author.id === this.invoker._client.user.id) {
            this.message = await this.invoker.edit(messageContent);
        } else {
            this.message = await this.invoker.channel.createMessage(messageContent)
        }

        //this.handler = new ReactionHandler.continuousReactionStream(this.message, (userID) => userID === this.invoker.author.id, false, { maxMatches: this.maxMatches, time: this.timeout });


    }

    /**
     * Updates the embed's content with the new page
     */
    update(interaction) {
        return interaction.editParent({
            content: (this.showPages) ? `Page **${this.page}** of **${this.pages.length}**` : undefined,
            embed: this.pages[this.page - 1],
        });
    }

    /**
     * Main method handling the reaction listening and content updating
     */
    async run() {
        this.invoker._client.on("interactionCreate", async (interaction) => {
            if(!interaction.data) return;
            if (interaction.member.id !== this.invoker.author.id) {
                interaction.createMessage({content: "You must have run the command in order to use the buttons!", flags: 64})
                return;
            }

            const event = interaction.data.custom_id.split("#")[1];
            
            switch (event.toLowerCase()) {
                case "first": {
                    if (this.page > 1) {
                        this.page = 1;
                        this.update(interaction);
                    }
                    break;
                }

                case "back": { 
                    if (this.page > 1) {
                        this.page--;
                        this.update(interaction);
                    } else if (this.page === 1 && this.cycling) {
                        this.page = this.pages.length;
                        this.update(interaction);
                    }
                    break;
                }

                case "forth": {
                    if (this.page < this.pages.length) {
                        this.page++;
                        this.update(interaction);
                    } else if (this.page === this.pages.length && this.cycling) {
                        this.page = 1;
                        this.update(interaction);
                    }
                    break;
                }

                case "last": {
                    if (this.page < this.pages.length) {
                        this.page = this.pages.length;
                        this.update(interaction);
                    }
                    break;
                }

                case "delete": {
                    await interaction.editParent({ components: [] });
                    break;
                }
                default: {
                    await interaction.acknowledge();
                }
            }

        });
    }
}

/**
* Create an Embed Paginator
*
* @param {Message} message A message object emitted from a messageCreate event coming from Eris, used as an invoker. If sent by the client, the message will be edited.
* @param {EmbedBase[]} pages An array containing all embed objects
* @param {PaginationOptions} [options] An optional options object for overwriting defaults
*/
export const createPaginationEmbed = async (message, pages, options) => {
    const paginationEmbed = new PaginationEmbed(message, pages, options);
    await paginationEmbed.initialize();
    paginationEmbed.run();

    return Promise.resolve(paginationEmbed.message);
}