import { LaunchModule } from "@nedbot/sharder";

export default class Launch extends LaunchModule {
  public async launch() { 
    console.log("ALL CLUSTERS READY"); // just to make sure it works.

  }
}