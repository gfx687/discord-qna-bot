import { handleCommandNotFound } from "./slash-commands/not-implemented.ts";
import { handleQnaAutocomplete, handleQnaCommand } from "./slash-commands/qna-search.ts";
import { EditModalCustomId, handleQnaEditCommand, handleQnaEditModalSubmit } from "./slash-commands/qna-edit.ts";
import { handleQnaDeleteCommand } from "./slash-commands/qna-delete.ts";
import { handleQnaNewCommand, handleQnaNewModalSubmit, NewQuestionModalCustomId } from "./slash-commands/qna-new.ts";
import { handleAcronymSearch } from "./slash-commands/acronyms.ts";
import {
  AnyRequestData,
  CommandAutocompleteRequestData,
  CommandStringOption,
  GuildCommandAutocompleteRequestData,
  GuildInteractionRequestData,
  GuildMessageComponentRequestData,
  GuildModalSubmitRequestData,
  InteractionRequestData,
  InteractionResponseFlags,
  InteractionResponseType,
  InteractionType,
  MessageComponentRequestData,
  ModalSubmitRequestData,
} from "npm:slash-create";
import {
  GuildRequestData,
  InteractionResponse,
  InteractionResponseAutocomplete,
  InteractionResponseModal,
  InteractionResponseReply,
} from "./data/discord-types.ts";
import { handleQnaHelp } from "./slash-commands/qna-help.ts";
import { saveInvocationLog } from "./data/invocation-log-repository.ts";
import { invocationLogInsertZod } from "./data/invocation-log-types.ts";
import { getInteractionOptionString } from "./slash-commands/common.ts";
import { ChatMessageResponse } from "./slash-commands/common.ts";
import { handleDRGWeaponSearch, handleWeaponAutocomplete } from "./slash-commands/drg-weapons.ts";

export async function handleInteraction(interaction: AnyRequestData): Promise<InteractionResponse | undefined> {
  if (interaction.type === InteractionType.PING) {
    return {
      type: InteractionResponseType.PONG,
    };
  }

  // bot only works for discord servers at the moment, not DMs
  // so here is a little hack to not do similar DMs vs Guild check in every command
  if (!isGuildRequest(interaction)) {
    return handleCommandNotFound();
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    const response = await handleCommands(interaction);
    return response;
  }
  if (interaction.type === InteractionType.MESSAGE_COMPONENT) {
    const response = handleMessageComponent(interaction);
    return response;
  }
  if (interaction.type === InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE) {
    const response = await handleAutocomplete(interaction);
    return response;
  }
  if (interaction.type === InteractionType.MODAL_SUBMIT) {
    const response = await handleModalSubmit(interaction);
    return response;
  }

  // bad request
  return undefined;
}

export async function handleCommands(
  interaction: GuildInteractionRequestData,
): Promise<InteractionResponseReply | InteractionResponseModal> {
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
    case "qna-help":
      return handleQnaHelp();
    case "acronym":
      return await handleAcronymSearch(interaction);
    case "weapon":
      return await handleDRGWeaponSearch(interaction);
    default:
      return handleCommandNotFound();
  }
}

export async function handleAutocomplete(
  interaction: GuildCommandAutocompleteRequestData,
): Promise<InteractionResponseReply | InteractionResponseAutocomplete> {
  switch (interaction.data.name) {
    case "qna":
    case "qna-edit":
    case "qna-delete":
      return await handleQnaAutocomplete(interaction);
    case "weapon":
        return await handleWeaponAutocomplete(interaction)
    default:
      return {
        type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
        data: { choices: [] },
      };
  }
}

export function handleMessageComponent(interaction: GuildMessageComponentRequestData): InteractionResponseReply {
  switch (interaction.data.custom_id) {
    default:
      return ChatMessageResponse("Something went wrong. Handler not found.", InteractionResponseFlags.EPHEMERAL);
  }
}

export async function handleModalSubmit(interaction: GuildModalSubmitRequestData): Promise<InteractionResponseReply> {
  if (interaction.data.custom_id.startsWith(EditModalCustomId)) {
    return await handleQnaEditModalSubmit(interaction);
  }
  if (interaction.data.custom_id == NewQuestionModalCustomId) {
    return await handleQnaNewModalSubmit(interaction);
  }

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: "Something went wrong. Handler not found.",
      flags: InteractionResponseFlags.EPHEMERAL,
    },
  };
}

export async function LogInvocation(interaction: GuildInteractionRequestData) {
  let option: CommandStringOption | undefined;
  option = getInteractionOptionString(interaction, "question");
  if (!option) {
    option = getInteractionOptionString(interaction, "acronym");
  }
  if (!option) {
    option = getInteractionOptionString(interaction, "weapon-name");
  }

  try {
    const log = invocationLogInsertZod.parse({
      guildId: interaction.guild_id,
      userId: interaction.member.user.id,
      username: interaction.member.user.username,
      userGlobalName: interaction.member.user.global_name,
      command: interaction.data.name,
      question: option?.value || "<unknown>",
    });

    await saveInvocationLog(log);
  } catch (err) {
    console.error(`LogInvocation failure: ${err}`);
  }
}

function isGuildRequest(
  data: InteractionRequestData | MessageComponentRequestData | CommandAutocompleteRequestData | ModalSubmitRequestData,
): data is GuildRequestData {
  return "guild_id" in data;
}
