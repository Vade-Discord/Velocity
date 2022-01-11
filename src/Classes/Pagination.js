'use strict';
import constants from '../Interfaces/Constants';
import config from 'src/config.json';

/**
 * @typedef {import('eris').EmbedBase} EmbedBase
 * @typedef {import('eris').Message} Message
 * @typedef {Object} PaginationOptions An optional options object for overwriting defaults
 * @property {Boolean} [showPageNumbers] Whether or not to show the current page index over the embed. Defaults to: true
 * @property {Boolean} [ephemeral] Whether to display all the pagination inside an ephermeral message. Defaults to: false
 * @property {Boolean} [extendedButtons] Whether or not to show extended control buttons besides standard pagination (First & Last page, deleting)
 * @property {Boolean} [cycling] Cycle through all embeds jumping from the first page to the last page on going back and from the last page to the first page going forth. Defaults to: false
 * @property {Number} [maxMatches] How often the reaction handler should listen for a reaction (How often the paginator can be used). Defaults to: 50. Maximum: 100
 * @property {Number} [timeout] How long the paginator should work before the reaction listener times out. Defaults to: 300000ms (5 minutes). Maximum: 900000ms (15 minutes)
 * @property {String} [deleteButton] Emoji which should be used as the delete button. This MUST be a unicode emoji! Defaults to: 🗑
 * @property {String} [firstButton] Emoji which should be used as the first page button. This MUST be a unicode emoji! Defaults to: ⏮
 * @property {String} [lastButton] Emoji which should be used as the last page button. This MUST be a unicode emoji! Defaults to: ⏭
 * @property {String} [backButton] Emoji which should be used as the back button. This MUST be a unicode emoji! Defaults to: ⬅
 * @property {String} [forthButton] Emoji which should be used as the forth button. This MUST be a unicode emoji! Defaults to: ➡
 * @property {String} [commandName] The Command name
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
     * @param interaction
     * @param {EmbedBase[]} pages An array containing all embed objects
     * @param {PaginationOptions} [options] An optional options object for overwriting defaults
     */
    constructor(interaction, pages = [], options = {}) {
        this.pages       = pages;
        this.invoker     = interaction;
        this.invokerRequired = options.invokerRequired || true;
        this.options     = options;
        this.cmdname     = options.commandName;
        this.delete      = options.deleteButton  || constants.emojis.trash.id;
        this.firstPage   = options.firstButton   || '⏮';
        this.lastPage    = options.lastButton    || '⏭';
        this.back        = options.backButton    || constants.emojis.arrow_left.id;
        this.forth       = options.forthButton   || constants.emojis.arrow_right.id;
        this.page        = options.startPage     || 1;
        this.cycling     = options.cycling       || true
        this.ephemeral = options.ephemeral || false;
        this.showPages   = (typeof options.showPageNumbers !== 'undefined') ? options.showPageNumbers : true;
        this.advanced    = (typeof options.extendedButtons !== 'undefined') ? options.extendedButtons : false;
        this.components = undefined;
        this.message = undefined;
    }

    /**
     * Runs a set of initialization checks, sets up the reaction listener for continuous listening and displays the initial Embed
     * @async
     */

    async initialize() {

        if (this.page < 1 || this.page > this.pages.length) {
            return Promise.reject(new Error(`Invalid start page! Must be between 1 (first) and ${this.pages.length} (last)`));
        }

        if (this.advanced) {
            this.components = [{
                type: 1,
                components: [{
                    custom_id: `pagination#first`,
                    emoji: {id: this.back,  name: constants.emojis.arrow_left.name},
                    disabled: false,
                    style: 2,
                    type: 2,
                }, {
                    custom_id: `pagination#back`,
                    emoji: {id: this.back, name: constants.emojis.arrow_left.name},
                    disabled: false,
                    style: 1,
                    type: 2,
                }, {
                    custom_id: `pagination#forth`,
                    emoji: {id: this.forth, name: constants.emojis.arrow_right.name},
                    disabled: false,
                    style: 1,
                    type: 2,
                },{
                    custom_id: `pagination#last`,
                    emoji: {id: this.forth, name: constants.emojis.arrow_right.name},
                    disabled: false,
                    style: 2,
                    type: 2,
                },{
                    custom_id: `pagination#delete`,
                    emoji: {id: this.delete, name: constants.emojis.trash.name},
                    disabled: false,
                    style: 4,
                    type: 2,
                }]
            }]
        } else {
            this.components = [{
                type: 1,
                components: [{
                    custom_id: `pagination#back`,
                    emoji: {id: this.back, name: constants.emojis.arrow_left.name},
                    disabled: false,
                    style: 1,
                    type: 2,
                }, {
                    custom_id: `pagination#forth`,
                    emoji: {id: this.forth, name: constants.emojis.arrow_right.name},
                    disabled: false,
                    style: 1,
                    type: 2,
                }]
            }]
        }

        const messageContent = {
            embeds: [this.pages[this.page - 1]],
            components: this.components,
            flags: this.ephemeral ? 64 : 0,
            content: !this.ephemeral ? (this.showPages) ? `Page **${this.page}** of **${this.pages.length}**` : undefined : undefined,
        }

        const CLIENTS = ['850723996513075200', '782309258620305438', '863550257790582846'];
        if (CLIENTS.includes(this.invoker.member.id)) {
            this.message = !this.ephemeral ? await this.invoker.edit(messageContent) : await this.invoker.editOriginalMessage(messageContent);
        } else {
            this.message = await this.invoker.createMessage(messageContent);
        }

        return this.message

    }
    //      content: (this.showPages) ? `Page **${this.page}** of **${this.pages.length}**` : undefined,

    async run(interaction) {

        if(interaction.user) interaction.member = interaction.user

        if (interaction.member.id !== this.invoker.member.id && this.invokerRequired === true) {
            return //interaction.createMessage({content: "You must have run the command in order to use the buttons!", flags: 64});
        }

        const event = interaction.data.custom_id.split("#")[1];
        switch (event.toLowerCase()) {
            case "first": {
                if (this.page > 1) {
                    this.page = 1;
                    await   this.update(interaction);
                }
                break;
            }

            case "back": {
                if (this.page > 1) {
                    this.page--;
                    await  this.update(interaction);
                } else if (this.page === 1 && this.cycling) {
                    this.page = this.pages.length;
                    await  this.update(interaction);
                }
                break;
            }

            case "forth": {
                if (this.page < this.pages.length) {
                    this.page++;
                    await this.update(interaction);
                } else if (this.page === this.pages.length && this.cycling) {
                    this.page = 1;
                    await  this.update(interaction);
                }
                break;
            }

            case "last": {
                if (this.page < this.pages.length) {
                    this.page = this.pages.length;
                    await this.update(interaction);
                }
                break;
            }

            case "delete": {
                await interaction.editParent({ components: [] });
                break;
            }
            default:
                return;
        }
    }

    /**
     * Updates the embed's content with the new page
     */
    //             components: interaction.message.components
    update(interaction) {

        if(!interaction.data) return;
        return interaction.message.edit({
            content: !this.ephemeral ? (this.showPages) ? `Page **${this.page}** of **${this.pages.length}**` : undefined : undefined,
            embeds: [this.pages[this.page - 1]],
            components: this.components,
            flags: this.ephemeral ? 64 : 0
        });
    }
}

/**
 * Create an Embed Paginator
 *
 * @param client
 * @param interaction
 * @param {EmbedBase[]} pages An array containing all embed objects
 * @param {PaginationOptions} [options] An optional options object for overwriting defaults
 */
export const createPaginationEmbed = async (client, interaction, pages, options) => {
    const paginationEmbed = new PaginationEmbed(interaction, pages, options);
    const mes = await paginationEmbed.initialize().then((m) => {
        client.Pagination.set(m?.id, paginationEmbed)
    });


    return Promise.resolve(paginationEmbed.message);
}