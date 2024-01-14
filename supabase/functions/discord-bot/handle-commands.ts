import { handleCommandNotFound } from "./slash-commands/not-implemented.ts";
import { handleQnaAutocomplete, handleQnaCommand } from "./slash-commands/qna-search.ts";
import { CommandInteraction, InteractionDataOption, MessageComponentInteraction, ModalSubmitInteraction } from "./types/types.ts";
import { InteractionResponse, InteractionResponseType, MessageFlags } from "./types/interaction-response-types.ts";
import { EditModalCustomId, handleQnaEditCommand, handleQnaEditModalSubmit } from "./slash-commands/qna-edit.ts";
import { handleQnaDeleteCommand } from "./slash-commands/qna-delete.ts";
import { handleQnaNewCommand, handleQnaNewModalSubmit, NewQuestionModalCustomId } from "./slash-commands/qna-new.ts";
import { supabase } from "../_shared/supabaseClient.ts";
import { handleAcronymSearch } from "./slash-commands/acronyms.ts";

export async function handleCommands(interaction: CommandInteraction): Promise<InteractionResponse> {
  await LogInvocation(interaction);

  switch (interaction.data.name) {
    case "qna":
      return await handleQnaCommand(interaction);
    case "qna-edit":
      return await handleQnaEditCommand(interaction);
    case "qna-delete":
      return await handleQnaDeleteCommand(interaction);
    case "qna-new":
      return handleQnaNewCommand(interaction);
    case "acronym":
      return handleAcronymSearch(interaction);
    default:
      return handleCommandNotFound(interaction);
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

export function handleMessageComponent(interaction: MessageComponentInteraction): InteractionResponse {
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
  if (interaction.data.custom_id == NewQuestionModalCustomId) {
    return await handleQnaNewModalSubmit(interaction);
  }

  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: "Something went wrong. Handler not found.",
      flags: MessageFlags.Ephemeral,
    },
  };
}

export async function LogInvocation(interaction: CommandInteraction) {
  let option: InteractionDataOption | undefined = undefined
  option = interaction.data?.options?.find((option) => option.name === "question");
  if (!option) {
    option = interaction.data.options.find((option) => option.name === "acronym");
  }

  await supabase.from("command_invocations_log")
    .insert({
      guild_id: interaction.guild_id,
      user_id: interaction.member.user.id,
      username: interaction.member.user.username,
      user_global_name: interaction.member.user.global_name,
      command: interaction.data.name,
      question: option?.value || "<unknown>",
    })
    .select();
}
