import { Client, Events, GatewayIntentBits } from "npm:discord.js";
import secrets from "./secrets.json" with { type: "json" };

if (!secrets || !secrets.BOT_TOKEN) {
  throw new Error("BOT_TOKEN not provided!");
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);

  client.guilds.cache.forEach((guild) => {
    console.log(`${guild.name} | ${guild.id}`);
  });
});

client.login(secrets.BOT_TOKEN);
