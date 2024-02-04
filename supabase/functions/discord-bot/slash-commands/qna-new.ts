import {
  ComponentActionRow,
  ComponentType,
  GuildInteractionRequestData,
  GuildModalSubmitRequestData,
  InteractionResponseFlags,
  InteractionResponseType,
  TextInputStyle,
} from "npm:slash-create";
import { ChatMessageResponse } from "./common.ts";
import { InteractionResponseModal, InteractionResponseReply } from "../data/discord-types.ts";
import { createQuestion } from "../data/question-repository.ts";
import { questionZod } from "../data/question-types.ts";

export const NewQuestionModalCustomId = "qna_new_modal";
const NewQuestionModalQuestionCustomId = "qna_new_modal_question";
const NewQuestionModalAnswerCustomId = "qna_new_modal_answer";

const UniqueViolationPostgresError = "23505";

/**
 * Handle initial /qna-new command call and return modal window to gather inputs
 */
export function handleQnaNewCommand(_interaction: GuildInteractionRequestData): InteractionResponseModal {
  return {
    type: InteractionResponseType.MODAL,
    data: {
      custom_id: NewQuestionModalCustomId,
      title: "New question",
      components: [
        {
          type: ComponentType.ACTION_ROW,
          components: [
            {
              type: ComponentType.TEXT_INPUT,
              style: TextInputStyle.SHORT,
              label: "Question",
              custom_id: NewQuestionModalQuestionCustomId,
              min_length: 1,
              max_length: 100,
              placeholder: "Enter question here",
              required: true,
            },
          ],
        },
        {
          type: ComponentType.ACTION_ROW,
          components: [
            {
              type: ComponentType.TEXT_INPUT,
              style: TextInputStyle.PARAGRAPH,
              label: "Answer",
              custom_id: NewQuestionModalAnswerCustomId,
              min_length: 1,
              max_length: 1000,
              placeholder: "Answer to the question",
              required: true,
            },
          ],
        },
      ],
    },
  };
}

/**
 * Handle /qna-new modal window submit and create new question in database accordingly
 */
export async function handleQnaNewModalSubmit(
  interaction: GuildModalSubmitRequestData,
): Promise<InteractionResponseReply> {
  let question: string | undefined;
  let answer: string | undefined;

  const actionRows = interaction.data.components.map((x) => x as ComponentActionRow);
  for (const actionRow of actionRows) {
    for (const textInput of actionRow.components) {
      if (textInput.type == ComponentType.TEXT_INPUT && textInput.custom_id == NewQuestionModalQuestionCustomId) {
        question = textInput.value;
      }
      if (textInput.type == ComponentType.TEXT_INPUT && textInput.custom_id == NewQuestionModalAnswerCustomId) {
        answer = textInput.value;
      }
    }
  }

  const newQuestion = questionZod.safeParse({
    guildId: interaction.guild_id,
    question: question,
    answer: answer,
  });
  if (!newQuestion.success) {
    const issues = newQuestion.error.issues.map((i) => i.message).join("; ");
    return ChatMessageResponse(`Validation error. Problems: ${issues}.`, InteractionResponseFlags.EPHEMERAL);
  }

  try {
    await createQuestion(newQuestion.data);
  } catch (err) {
    if (err.code == UniqueViolationPostgresError) {
      return ChatMessageResponse(`Question "${question}" already exists.`, InteractionResponseFlags.EPHEMERAL);
    }
    throw err;
  }

  return ChatMessageResponse(
    `New question "${newQuestion.data.question}" has been added.\n\n${newQuestion.data.answer}`,
  );
}
