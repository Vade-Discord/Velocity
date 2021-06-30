export default {
  colours: {
    turquoise: "#40e0d0",
    error: "RED",
    success: "GREEN",
    random: "RANDOM",
    purple_dark: "#6a006a",
    purple_medium: "#a958a5",
    purple_light: "#c481fb",
    orange: "#ffa500",
    gold: "#daa520",
    red_dark: "#8e2430",
    red_light: "#f94343",
    blue_dark: "#3b5998",
    cyan: "#5780cd",
    blue_light: "#ace9e7",
    aqua: "#33a1ee",
    pink: "#ff9dbb",
    green_dark: "#2ac075",
    green_light: "#a1ee33",
    white: "#f9f9f6",
    green: "#00C09A",
    cream: "#ffdab9",
    see_through: "#2f3136",
  },
  emojis: {

        placeholder: {
            name: "placeholder",
            id: "851643272195735562",
        },
        //Check and X
        check: {
            name: "vade_check",
            id: "834423303711227966",
            mention: "<:vade_check:834423303711227966>",
        },
        x: {
            name: "vade_x",
            id: "834428827795062873",
            mention: "<:vade_x:834428827795062873>",
        },
        //Arrows
        arrow_up: {
            name: "arrow_up_white",
            id: "858884728077287445",
            mention: "<:arrow_up_white:858884728077287445> ",
        },
        arrow_down: {
            name: "arrow_down_white",
            id: "858884742648954910",
            mention: "<:arrow_down_white:858884742648954910>",
        },
        arrow_left: {
            name: "arrow_left_white",
            id: "858884746516234240",
            mention: "<:arrow_left_white:858884746516234240>",
        },
        arrow_right: {
            name: "arrow_right_white",
            id: "858884727725490206",
            mention: "<:arrow_right_white:858884727725490206>",
        },
        //Icons
        trash: {
            name: "trash",
            id: "858925009078452304",
            mention: "<:trash:858925009078452304>",

        },
        role: {
            name: "role",
            id: "825769238736273420",
            mention: "<:role:825769238736273420>",
        },
        moderation: {
            name: "moderation",
            id: "858884725484552223",
            mention: "<:moderation:858884725484552223>"
        },
        boost: {
            name: "boost",
            id: "859808624804233317",
            mention: "<:boost:859808624804233317>",
        }
    },
  perms: {
    admin: "ADMINISTRATOR",
    mod: "MANAGE_MESSAGES",
    send: "SEND_MESSAGES",
    view: "VIEW_CHANNEL",
  },
} as const;
