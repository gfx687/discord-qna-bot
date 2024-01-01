// https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type
export enum InteractionType {
  Ping = 1,
  ApplicationCommand = 2,
  MessageComponent = 3,
  ApplicationCommandAutocomplete = 4,
  ModalSubmit = 5,
}

// https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type
export enum ApplicationCommandOptionType {
  SubCommand = 1,
  SubCommandGroup = 2,
  String = 3,
  Integer = 4,
  Boolean = 5,
  User = 6,
  Channel = 7,
  Role = 8,
  Mentionable = 9,
  Number = 10,
  Attachment = 11,
}

// https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-structure
export type Interaction = {
  /**
   * Type of the interaction
   */
  type: InteractionType;

  /**
   * Interaction data payload
   */
  data: InteractionData;

  /**
   * Discord server id
   */
  guild_id: number;

  /**
   * Channel id (like a text channel / thread / etc)
   */
  channel_id: number;

  /**
   * Info about user in the context of guild
   */
  member: GuildMember;
};

// https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-data
export type InteractionData = {
  /**
   * ID of the invoked command
   */
  id: number;

  /**
   * Name of the invoked command
   */
  name: string;

  /**
   * Type of the invoked command
   */
  type: number; // TODO: enum?

  /**
   * Params and values from the user (can be partially filled for autocomplete interactions)
   */
  options: InteractionDataOption[];
};

// https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-application-command-interaction-data-option-structure
export type InteractionDataOption = {
  /**
   * Parameter name
   */
  name: string;

  /**
   * Data type
   */
  type: ApplicationCommandOptionType;

  /**
   * Value of the option (no required for some types of interactions, e.g. autocomplete)
   */
  value: string;
};

// https://discord.com/developers/docs/resources/user#user-object-user-structure
export type User = {
  id: number;
  username: string;
  global_name: string;
};

// TODO: roles, permissions
// https://discord.com/developers/docs/resources/guild#guild-member-object
export type GuildMember = {
  user: User;
};
