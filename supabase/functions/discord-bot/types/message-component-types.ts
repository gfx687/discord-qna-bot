// https://discord.com/developers/docs/interactions/message-components#component-object-component-types
export enum MessageComponentType {
  /** Container for other components */
  ActionRow = 1,

  /** Button object */
  Button = 2,

  /** Select menu for picking from defined text options */
  StringSelect = 3,

  /** Text input object */
  TextInput = 4,

  /** Select menu for users */
  UserSelect = 5,

  /** Select menu for roles */
  RoleSelect = 6,

  /** Select menu for mentionables (users and roles) */
  MentionableSelect = 7,

  /** Select menu for channels */
  ChannelSelect = 8,
}

export enum MessageComponentButtonStyle {
  /** Primary button with color "blurple" and custom ID */
  Primary = 1,

  /** Secondary button with color "grey" and custom ID */
  Secondary = 2,

  /** Success button with color "green" and custom ID */
  Success = 3,

  /** Danger button with color "red" and custom ID */
  Danger = 4,

  /** Link button with color "grey" that navigates to a URL * URL: custom_id
   */
  Link = 5,
}

export enum MessageComponentTextInputStyle {
  /** Short input type (Single-line input) */
  Short = 1,

  /** Paragraph input type (Multi-line input) */
  Paragraph = 2,
}

export type MessageComponent = MessageComponentActionRow | MessageComponentTextInput | MessageComponentButton;

// https://discord.com/developers/docs/interactions/message-components#action-rows
export type MessageComponentActionRow = {
  type: MessageComponentType.ActionRow;
  components: MessageComponent[];
};

// https://discord.com/developers/docs/interactions/message-components#text-inputs
export type MessageComponentTextInput = {
  type: MessageComponentType.TextInput;
  style: MessageComponentTextInputStyle;
  custom_id: string;
  required: boolean;
  placeholder: string;

  /** Max 45 characters */
  label: string;

  /** Minimum input length for a text input; min 0, max 4000 */
  min_length: number;

  /** Maximum input length for a text input; min 1, max 4000 */
  max_length: number;

  /**
   * Pre-filled value for this component; max 4000 characters
   * If there is no value provided modal will remember input made by user (if he closes modal without sending)
   */
  value?: string;
};

// https://discord.com/developers/docs/interactions/message-components#buttons
export type MessageComponentButton = {
  type: MessageComponentType.Button;
  label: string;
  style: MessageComponentButtonStyle;
  custom_id: string;
};
