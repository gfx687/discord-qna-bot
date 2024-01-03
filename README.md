# discord-qna-bot
Discord for with Questions and Answers functionality

### How to add bot to your server
Ask me for bot invite link

**What will bot be able to do in my server?**  
When you follow the bot invite link you will see full list of requested permissions.  

Bot only needs one permission to work:
- Create commands

### How to configure users' permissions to access bot commands
Configuring access of users to bot's commands

Complete following steps as **server admin**:
1) Create new role 'Q&A editor'  
    Role name can be whatever you want it to be. Can also give permissions to specific users.
2) Right click on Server -> Server Settings -> Overview -> Integrations -> Q&A bot
3) Change default bot permission from @everyone to Q&A role  
    It will be simpler to manage permissions if you restrict access to commands by default and only allow specific commands to @everyone than the other way around.  
    It will also allow you to not change anything if new command releases.
4) Go to /qna command in the list of commands and override it for @everyone

Done, now Q&A role (and server owner by default) has access to every command and @everyone only to /qna