This folder contains a random pile of helpful code snippets to control the bot.

The code contained in this folder is **not** used by the application.

## How to use:

**Prerequisites:**
1) Copy `secrets-format.json` file as `secrets.json` and fill it with your bot's data  
    You can find Application ID and reset Bot Token (if you lost it) here - https://discord.com/developers/applications  

NOTE: Some, but not all, scripts require more secrets. For most just `APPLICATION_ID` and `BOT_TOKEN` are enough.

### Python scripts
1) Make sure that you have python library `requests` installed  
    ```bash
    pip install requests
    ```
2) Run command from the project's root  
    ```bash
    py bot-control-commands/commands-get.py
    ```

### TypeScript scripts
1) Run command from any location (adjust path if not in project's root)
    ```bash
    deno run -A bot-control-commands/what-guilds-my-bot-is-in.ts 
    ```