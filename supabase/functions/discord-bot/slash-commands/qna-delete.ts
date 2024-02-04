import { GuildInteractionRequestData, InteractionResponseFlags } from "npm:slash-create";
import { ChatMessageResponse, getInteractionOptionString } from "./common.ts";
import { InteractionResponseReply } from "../data/discord-types.ts";
import { getQuestion } from "../data/question-repository.ts";
import { deleteQuestion } from "../data/question-repository.ts";

export const EditModalCustomId = "qna_edit_modal";
export const EditModalAnswerInputCustomId = "qna_edit_modal_new_answer";

export async function handleQnaDeleteCommand(
  interaction: GuildInteractionRequestData,
): Promise<InteractionResponseReply> {
  const option = getInteractionOptionString(interaction, "question");
  if (option?.value == null || option.value.trim() == "") {
    return ChatMessageResponse(
      "Question cannot be empty when using delete command.",
      InteractionResponseFlags.EPHEMERAL,
    );
  }

  const question = await getQuestion(interaction.guild_id, option.value);
  if (question == null) {
    return ChatMessageResponse(
      "No question found. Make sure to provide full name of the question, delete command does not allow for ambiguity in search term.",
      InteractionResponseFlags.EPHEMERAL,
    );
  }

  await deleteQuestion(interaction.guild_id, option.value);

  return ChatMessageResponse(`Done. Question "${option.value}" has been deleted.`);
}
