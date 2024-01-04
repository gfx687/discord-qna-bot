import { GuildMember } from "./user.ts";
import { MessageComponent, MessageComponentType } from "./message-component-types.ts";

// https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type
export enum InteractionType {
  Ping = 1,

  /** Slash command */
  ApplicationCommand = 2,
  MessageComponent = 3,
  ApplicationCommandAutocomplete = 4,
  ModalSubmit = 5,
}

// https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types
export enum ApplicationCommandType {
  /** Slash commands; a text-based command that shows up when a user types / */
  ChatInput = 1,

  /** A UI-based command that shows up when you right click or tap on a user */
  User = 2,

  /** A UI-based command that shows up when you right click or tap on a message */
  Message = 3,
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
export type Interaction =
  | PingInteraction
  | CommandInteraction
  | MessageComponentInteraction
  | ModalSubmitInteraction;

export type PingInteraction = {
  type: InteractionType.Ping;
};

type InteractionCommon = {
  channel_id: string;
  guild_id: string;
  member: GuildMember;
};

export type CommandInteraction = InteractionCommon & {
  type: InteractionType.ApplicationCommand | InteractionType.ApplicationCommandAutocomplete;
  data: InteractionDataCommand;
};

export type MessageComponentInteraction = InteractionCommon & {
  type: InteractionType.MessageComponent;
  data: InteractionDataButton;
};

export type ModalSubmitInteraction = InteractionCommon & {
  type: InteractionType.ModalSubmit;
  data: InteractionDataModal;
};

// https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-data
export type InteractionDataCommand = {
  id: number;
  name: string;
  type: ApplicationCommandType;

  /** Params and values from the user (can be partially filled for autocomplete interactions) */
  options: InteractionDataOption[];
};

// https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-message-component-data-structure
export type InteractionDataButton = {
  custom_id: string;
  component_type: MessageComponentType.Button;
};

// https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-modal-submit-data-structure
export type InteractionDataModal = {
  custom_id: string;
  components: MessageComponent[];
};

// https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-application-command-interaction-data-option-structure
export type InteractionDataOption = {
  /** Parameter name */
  name: string;

  /** Data type */
  type: ApplicationCommandOptionType;

  /** Value of the option (no required for some types of interactions, e.g. autocomplete) */
  value: string;

  /** For autocompletion requests. True if user if currently typing this option */
  focused?: boolean;
};
