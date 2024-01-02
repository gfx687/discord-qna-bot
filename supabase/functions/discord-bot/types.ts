// https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type
export enum InteractionType {
  Ping = 1,
  /**
   * Slash command
   */
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

// https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type
export enum InteractionResponseType {
  /**
   * ACK a Ping
   */
  Pong = 1,

  /**
   * Respond to an interaction with a message, bot's message will be a reply
   */
  ChannelMessageWithSource = 4,

  /**
   * ACK an interaction and edit a response later, the user sees a loading state
   */
  DeferredChannelMessageWithSource = 5,

  /**
   * For components, ACK an interaction and edit the original message later; the user does not see a loading state
   */
  DeferredUpdateMessage = 6,

  /**
   * For components, edit the message the component was attached to
   */
  UpdateMessage = 7,

  /**
   * Respond to an autocomplete interaction with suggested choices
   */
  ApplicationCommandAutocompleteResult = 8,

  /**
   * Respond to an interaction with a popup modal
   */
  Modal = 9,

  /**
   * Respond to an interaction with an upgrade button, only available for apps with monetization enabled
   */
  PremiumRequired = 10,
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

// https://discord.com/developers/docs/resources/guild#guild-member-object
export type GuildMember = {
  user: User;
};

// https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object
export type InteractionResponse = {
  type: InteractionResponseType;

  /**
   * Text message content
   */
  data: InteractionResponseData;
};

/**
 * Exact payload structure of the Response depends on response Type
 */
export type InteractionResponseData = {
  /**
   * Text message content
   */
  content: string;
};
