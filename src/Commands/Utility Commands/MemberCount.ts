import Command from "../../Interfaces/Command";
import { RichEmbed } from "eris";
import dic from "custom-translate";
let dictionary = {
  a: "ɐ",
  b: "q",
  c: "ɔ",
  d: "p",
  e: "ǝ",
  f: "ɟ",
  g: "ƃ",
  h: "ɥ",
  i: "ᴉ",
  j: "ɾ",
  k: "ʞ",
  m: "ɯ",
  n: "u",
  p: "d",
  q: "b",
  r: "ɹ",
  t: "ʇ",
  u: "n",
  v: "ʌ",
  w: "ʍ",
  y: "ʎ",
  A: "∀",
  C: "Ɔ",
  E: "Ǝ",
  F: "Ⅎ",
  G: "פ",
  J: "ſ",
  L: "˥",
  M: "W",
  P: "Ԁ",
  T: "┴",
  U: "∩",
  V: "Λ",
  W: "M",
  Y: "⅄",
  1: "Ɩ",
  2: "ᄅ",
  3: "Ɛ",
  4: "ㄣ",
  5: "ϛ",
  6: "9",
  7: "ㄥ",
  9: "6",
  ",": "'",
  ".": "˙",
  "'": ",",
  '"': ",,",
  _: "‾",
  "&": "⅋",
  "!": "¡",
  "?": "¿",
  "`": ",",
};

export default class ServerinfoCommand extends Command {
  constructor(client) {
    super(client, "membercount", {
      description: "View the Servers member count!",
      category: "Utility",
      guildOnly: true,
    });
  }
  async run(message, args) {
    let embed = new RichEmbed()
      .setTitle(`${message.guild.name}'s member count`)
      .setDescription(`Members: **${message.channel.guild.memberCount}**`)
      .setFooter(`Vade | MemberCount`);

    return message.channel.createMessage({ embed: embed });
  }
}
