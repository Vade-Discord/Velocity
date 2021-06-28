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
    super(client, "textflip", {
      description: "Flip some text upside down!",
      category: "Utility",
      guildOnly: true,
    });
  }
  async run(message, args) {
    const text = args.join(" ");
    if (!text)
      return message.channel.createMessage(
        `You need to specify some text to flip!`,
        message.channel
      );
    const converted = dic.letterTrans(text, dictionary);
    message.channel.createMessage(converted);
  }
}