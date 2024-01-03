// https://discord.com/developers/docs/resources/user#user-object-user-structure
export type User = {
  id: string;
  username: string;
  global_name: string;
};

// https://discord.com/developers/docs/resources/guild#guild-member-object
export type GuildMember = {
  user: User;
};
