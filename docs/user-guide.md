## How to Add the Bot to Your Server

Ask me for the bot invite link.

**What will the bot be able to do on my server?**  
When you follow the invite link,  you will see full list of requested permissions before adding the bot.

The bot only needs one permission to work:
- Create commands

## How to Configure User Permissions to Access Bot Commands
Configuring access of users to bot's commands

Complete following steps as the **server admin**:
1) Create a new role called 'Q&A editor'.  
    The role name can be anything you prefer. You can also grant permissions to specific users.
2) Right-click on your server -> Server Settings -> Overview -> Integrations -> Q&A bot.
3) Change default bot permission from @everyone to the Q&A role.  
    It's easier to manage permissions by restricting access to commands by default and allowing specific commands for @everyone.  
    This approach also ensures you don't need to make changes when new commands are released.
4) Navigate to the /qna command in the list of commands and override it for @everyone.

You're done! Now, the Q&A role (and the server owner by default) has access to every command, while @everyone only has access to /qna.