import { MessageComponent } from "./message-component-types.ts";

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

// Message flags https://discord.com/developers/docs/resources/channel#message-object-message-flags
export enum MessageFlags {
  /**
   * Bot response is only visible to person who invoked the command
   */
  Ephemeral = 64,
}

// https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object
export type InteractionResponse =
  | InteractionResponseReply
  | InteractionResponseAutocomplete
  | InteractionResponseModal;

export type InteractionResponseReply = {
  type: InteractionResponseType.ChannelMessageWithSource;
  data: InteractionResponseMessageData;
};

export type InteractionResponseAutocomplete = {
  type: InteractionResponseType.ApplicationCommandAutocompleteResult;
  data: InteractionResponseAutocompleteData;
};

export type InteractionResponseModal = {
  type: InteractionResponseType.Modal;
  data: InteractionResponseModalData;
};

// https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-messages
export type InteractionResponseMessageData = {
  /**
   * Text message content
   */
  content: string;

  /**
   * Message components, like buttons and such
   */
  components?: MessageComponent[];

  flags?: MessageFlags;
};

// https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-autocomplete
export type InteractionResponseAutocompleteData = {
  choices: ApplicationCommandOptionChoice<string>[];
};

// https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-choice-structure
export type ApplicationCommandOptionChoice<T extends string | number> = {
  name: string;
  value: T;
};

export type InteractionResponseModalData = {
  custom_id: string;
  title: string;
  components: MessageComponent[];
};
