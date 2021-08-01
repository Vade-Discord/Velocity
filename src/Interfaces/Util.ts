import type {Bot} from "../client/Client";
import Command from "./Command";

// Package imports
import {Collection, Guild, Member, RichEmbed} from "eris";
import axios from "axios";
import { distance } from "fastest-levenshtein";
import {Types} from "mongoose";


// File imports
import guild_schema from "../Schemas/Main Guilds/GuildSchema";

interface SelectionObject {
  label: string;
  value: string;
  description: string;
  emoji: {
    name: string;
    id: string;
  },
}

export default class Util {
  succEmbed(arg0: string, channel: any): unknown {
    throw new Error("Method not implemented.");
  }
  validateHex(arg0: string) {
    throw new Error("Method not implemented.");
  }
  sendError(arg0: string, channel: any): unknown {
    throw new Error("Method not implemented.");
  }
  public readonly client: Bot;

  private readonly yes: string[] = ["yes", "si", "yeah", "ok", "sure"];
  private readonly no: string[] = ["no", "nope", "nada"];



  constructor(client: Bot) {
    this.client = client;
  }

}
