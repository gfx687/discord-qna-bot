This folder contains helpful code snippets that will allow you to see / register / delete your bot's slash commands.

The code contained in this folder is **not** used by the application.

How to use:
1) Copy `secrets-format.json` file as `secrets.json` and fill it with your bot's data  
    You can find Application ID and reset Bot Token (if you lost it) here - https://discord.com/developers/applications  
    P.S. `COMMAND_TO_DELETE` is not required unless you use delete command
2) Make sure that you have python library `requests` installed  
    ```bash
    pip install requests
    ```
3) Run command from the project's root  
    ```bash
    py bot-control-commands/commands-get.py
    ```