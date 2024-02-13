import { InteractionResponseAutocomplete, InteractionResponseReply } from "../data/discord-types.ts";
import { searchQuestions } from "../data/question-repository.ts";
import { getInteractionOptionString } from "./common.ts";
import { ChatMessageResponse } from "./common.ts";
import {
  GuildCommandAutocompleteRequestData,
  GuildInteractionRequestData,
  InteractionResponseFlags,
  InteractionResponseType,
} from "npm:slash-create";

export async function handleQnaAutocomplete(
  interaction: GuildCommandAutocompleteRequestData,
): Promise<InteractionResponseAutocomplete> {
  const option = _internal.getInteractionOptionString(interaction, "question");
  if (option?.value == null || option.value.trim() == "") {
    return {
      type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
      data: { choices: [] },
    };
  }

  const questions = await _internal.searchQuestions(interaction.guild_id, option.value);

  return {
    type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
    data: {
      choices: questions.map((x) => ({ name: x.question, value: x.question })),
    },
  };
}

export async function handleQnaCommand(
  interaction: GuildInteractionRequestData,
): Promise<InteractionResponseReply> {
  const option = _internal.getInteractionOptionString(interaction, "question");
  if (option?.value == null || option.value.trim() == "") {
    return ChatMessageResponse("Invalid question or something went wrong.", InteractionResponseFlags.EPHEMERAL);
  }

  const questions = await _internal.searchQuestions(interaction.guild_id, option.value);

  if (questions.length == 0) {
    return ChatMessageResponse(
      `No answers were found for question "${option.value}".`,
      InteractionResponseFlags.EPHEMERAL,
    );
  }

  return ChatMessageResponse(questions[0].answer);
}

export const _internal = {
  getInteractionOptionString,
  searchQuestions,
};
