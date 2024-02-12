import { GuildInteractionRequestData, InteractionResponseFlags } from "npm:slash-create";
import { ChatMessageResponse, getInteractionOptionString } from "./common.ts";
import { InteractionResponseReply } from "../data/discord-types.ts";
import { getQuestion } from "../data/question-repository.ts";
import { deleteQuestion } from "../data/question-repository.ts";

export async function handleQnaDeleteCommand(
  interaction: GuildInteractionRequestData,
): Promise<InteractionResponseReply> {
  const option = _internal.getInteractionOptionString(interaction, "question");
  if (option?.value == null || option.value.trim() == "") {
    return ChatMessageResponse(
      "Question cannot be empty when using delete command.",
      InteractionResponseFlags.EPHEMERAL,
    );
  }

  const question = await _internal.getQuestion(interaction.guild_id, option.value);
  if (question == null) {
    return ChatMessageResponse(
      "No question found. Make sure to provide full name of the question, delete command does not allow for ambiguity in search term.",
      InteractionResponseFlags.EPHEMERAL,
    );
  }

  await _internal.deleteQuestion(interaction.guild_id, question.question);

  return ChatMessageResponse(`Done. Question "${question.question}" has been deleted.`);
}

export const _internal = {
  getInteractionOptionString,
  getQuestion,
  deleteQuestion,
};
