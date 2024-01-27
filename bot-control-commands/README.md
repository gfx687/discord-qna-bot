The code contained in this folder is **not** used by the application.

## What are Those Scripts?
The TypeScript code in the project only handles answering to Discord Interaction. It does not register slash commands.

Registration of slash commands (adding them to the bot) was done using helper scripts in this folder. Each `*register*` script adds a slash command, rest are optional helpers.

## How to use

**Prerequisites:**
1) Copy `secrets-format.json` file as `secrets.json` and fill it with your bot's data  
    You can find Application ID and reset Bot Token (if you lost it) here - https://discord.com/developers/applications

NOTE: Some, but not all, scripts require more secrets. For most just `APPLICATION_ID` and `BOT_TOKEN` are enough.

### Python scripts
1) Make sure that you have python library `requests` installe
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
