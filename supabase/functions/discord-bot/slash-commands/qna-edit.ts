import { InteractionResponseModal, InteractionResponseReply } from "../data/discord-types.ts";
import { createEditProcess } from "../data/question-repository.ts";
import { updateQuestionAnswer } from "../data/question-repository.ts";
import { getEditProcess } from "../data/question-repository.ts";
import { getQuestion } from "../data/question-repository.ts";
import { questionEditProcessZod } from "../data/question-types.ts";
import { ChatMessageResponse, getInteractionOptionString } from "./common.ts";
import {
  ComponentActionRow,
  ComponentTextInput,
  ComponentType,
  GuildInteractionRequestData,
  GuildModalSubmitRequestData,
  InteractionResponseFlags,
  InteractionResponseType,
  TextInputStyle,
} from "npm:slash-create";

export const EditModalCustomId = "qna_edit_modal";
export const EditModalAnswerInputCustomId = "qna_edit_modal_new_answer";

/**
 * Handle initial /qna-edit command call and return modal window to gather inputs
 */
export async function handleQnaEditCommand(
  interaction: GuildInteractionRequestData,
): Promise<InteractionResponseReply | InteractionResponseModal> {
  const option = getInteractionOptionString(interaction, "question");
  if (option?.value == null || option.value.trim() == "") {
    return ChatMessageResponse("Question cannot be empty when using edit command.", InteractionResponseFlags.EPHEMERAL);
  }

  const question = await getQuestion(interaction.guild_id, option.value);
  if (question == null) {
    return ChatMessageResponse(
      "No question found. Make sure to provide full name of the question, edit command does not allow for ambiguity in search term.",
      InteractionResponseFlags.EPHEMERAL,
    );
  }

  // Save information about edit process to database because when modal is submitted we will not receive information
  // about command that spawned it (meaning we don't know what question user is editing).
  const processId = `${EditModalCustomId}_${crypto.randomUUID()}`;
  const editProcess = questionEditProcessZod.parse({
    processId: processId,
    guildId: question.guildId,
    question: question.question,
    startedAt: new Date(),
  });

  await createEditProcess(editProcess);

  return {
    type: InteractionResponseType.MODAL,
    data: {
      custom_id: processId,
      title: `Question: "${question.question}"`,
      components: [{
        type: ComponentType.ACTION_ROW,
        components: [{
          type: ComponentType.TEXT_INPUT,
          style: TextInputStyle.PARAGRAPH,
          label: "New answer",
          custom_id: EditModalAnswerInputCustomId,
          min_length: 1,
          max_length: 1000,
          placeholder: "placeholder",
          required: true,
          value: question.answer,
        }],
      }],
    },
  };
}

/**
 * Handle /qna-edit modal window submit and make changes to the question
 */
export async function handleQnaEditModalSubmit(
  interaction: GuildModalSubmitRequestData,
): Promise<InteractionResponseReply> {
  const editProcess = await getEditProcess(interaction.data.custom_id);

  if (editProcess == null) {
    return ChatMessageResponse(
      "Question not found. Unless someone deleted it while you were editing something went wrong.",
      InteractionResponseFlags.EPHEMERAL,
    );
  }

  const formInputs = interaction.data.components.find((c) => c.type == ComponentType.ACTION_ROW) as ComponentActionRow;
  const newAnswer = formInputs.components.find((c) =>
    c.type == ComponentType.TEXT_INPUT && c.custom_id == EditModalAnswerInputCustomId
  ) as ComponentTextInput;
  if (newAnswer?.value == null || newAnswer.value.trim() == "") {
    return ChatMessageResponse("Invalid answer was provided.", InteractionResponseFlags.EPHEMERAL);
  }

  await updateQuestionAnswer(editProcess.guildId, editProcess.question, newAnswer.value.trim());

  return ChatMessageResponse(`Saved new answer to question "${editProcess.question}".\n\n${newAnswer.value.trim()}`);
}
