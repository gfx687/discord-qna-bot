# discord-qna-bot

![qna search](docs/assets/qna-search.png)

> If you are looking for a **User Guide** or **visual examples** of the commands this bot provides, please check [User Guide](docs/user-guide.md).

Discord Bot with Questions and Answers (Q&A) functionality created using exclusively Discord's [Interaction API](https://discord.com/developers/docs/interactions/application-commands)

Creating a bot using only the Interactions API (slash commands) allows the bot to be deployed **serverless** and receive all updates from Discord instead of hosting bot 24/7 and querying the Discord Gateway API.

## Tech Stack
- **Hosting** - [Supabase](https://supabase.com/), Backend as a Service solution  
    Provides PostgreSQL database and Edge Functions runtime
- **Language** - TypeScript and Deno  
    Because Supabase uses Deno as Edge Functions platform
- **Discord Library** - none  
    At first I looked at [Discord.js](https://github.com/discordjs/discord.js) but it is a library for Discord's Gateway API rather than Interactions API. Meaning intended to be used for hosted bots that pull Discord updates, rather than have Discord deliver updates to the bot, which makes it unsuited for hosting serverless with just edge functions.

## Known Issues and Caveats
1) Currently, slash commands do not support multi-line inputs - https://github.com/discord/discord-api-docs/issues/2381

    Meaning User Experience of entering long strings is subpar to say the least.

    Possible workarounds:
    - Using Modal windows for long inputs (which is what I chose)  
        Downside of this approach is that Text Inputs on modal windows are obviously styled for mobile and cannot be resized. Better than no new lines at all but still not great
    - Have users enter string with literal '\n' in them  
        Amazing user experience isn't it? Maybe fine for personal use but definitely not for clients
    - Have user type separate normal message and create a [Message Command](https://discord.com/developers/docs/interactions/application-commands#message-commands) so user can Right Click on the message and choose action  
        Sounds better than second option but still highly unintuitive

2) Modal Windows cannot show custom errors to user - https://github.com/discord/discord-api-docs/discussions/4513

    When some error occurred / validation of input failed modal will close and only thing your bot can do is sending user a message that something went wrong. This modal closing action loses all the information user already filled in inputs and it is up to your bot to store and restore it.
