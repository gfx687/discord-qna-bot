import { handleHelloCommand } from "./slash-commands/hello.ts";
import { handleQnaAutocomplete, handleQnaCommand } from "./slash-commands/qna-search.ts";
import { CommandInteraction, MessageComponentInteraction, ModalSubmitInteraction } from "./types/types.ts";
import { InteractionResponse, InteractionResponseType, MessageFlags } from "./types/interaction-response-types.ts";
import { EditModalCustomId, handleQnaEditCommand, handleQnaEditModalSubmit } from "./slash-commands/qna-edit.ts";
import { handleQnaDeleteCommand } from "./slash-commands/qna-delete.ts";

export async function handleCommands(interaction: CommandInteraction): Promise<InteractionResponse> {
  switch (interaction.data.name) {
    case "qna":
      return await handleQnaCommand(interaction);
    case "qna-edit":
      return await handleQnaEditCommand(interaction);
    case "qna-delete":
      return await handleQnaDeleteCommand(interaction);
    default:
      return handleHelloCommand(interaction);
  }
}

export async function handleAutocomplete(interaction: CommandInteraction): Promise<InteractionResponse> {
  switch (interaction.data.name) {
    case "qna":
      return await handleQnaAutocomplete(interaction);
    case "qna-edit":
      return await handleQnaAutocomplete(interaction);
    case "qna-delete":
      return await handleQnaAutocomplete(interaction);
    default:
      return {
        type: InteractionResponseType.ApplicationCommandAutocompleteResult,
        data: { choices: [] },
      };
  }
}

export async function handleMessageComponent(interaction: MessageComponentInteraction): Promise<InteractionResponse> {
  switch (interaction.data.custom_id) {
    default:
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: "Something went wrong. Handler not found.",
          flags: MessageFlags.Ephemeral,
        },
      };
  }
}

export async function handleModalSubmit(interaction: ModalSubmitInteraction): Promise<InteractionResponse> {
  if (interaction.data.custom_id.startsWith(EditModalCustomId)) {
    return await handleQnaEditModalSubmit(interaction);
  }

  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: "Something went wrong. Handler not found.",
      flags: MessageFlags.Ephemeral,
    },
  };
}
