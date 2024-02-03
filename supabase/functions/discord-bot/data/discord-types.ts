import {
  AutocompleteChoice,
  GuildCommandAutocompleteRequestData,
  GuildInteractionRequestData,
  GuildMessageComponentRequestData,
  GuildModalSubmitRequestData,
  InteractionResponseFlags,
  InteractionResponseType,
  ModalOptions,
} from "npm:slash-create";

export type GuildRequestData =
  | GuildInteractionRequestData
  | GuildMessageComponentRequestData
  | GuildCommandAutocompleteRequestData
  | GuildModalSubmitRequestData;

export type InteractionResponse =
  | InteractionResponsePong
  | InteractionResponseReply
  | InteractionResponseAutocomplete
  | InteractionResponseModal;

export type InteractionResponsePong = {
  type: InteractionResponseType.PONG;
};

export type InteractionResponseReply = {
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE;
  data: {
    content: string;
    flags?: InteractionResponseFlags;
  };
};

export type InteractionResponseAutocomplete = {
  type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT;
  data: {
    choices: AutocompleteChoice[];
  };
};

export type InteractionResponseModal = {
  type: InteractionResponseType.MODAL;
  data: ModalOptions;
};
