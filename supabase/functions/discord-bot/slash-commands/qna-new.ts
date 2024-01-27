import {
ComponentActionRow,
  ComponentType,
  GuildInteractionRequestData,
  GuildModalSubmitRequestData,
  InteractionResponseFlags,
  InteractionResponseType,
  TextInputStyle,
} from "npm:slash-create";
import { supabase } from "../../_shared/supabaseClient.ts";
import { ChatMessageResponse } from "./common.ts";
import { InteractionResponseModal, InteractionResponseReply } from "../types/my-types.ts";

export const NewQuestionModalCustomId = "qna_new_modal";
const NewQuestionModalQuestionCustomId = "qna_new_modal_question";
const NewQuestionModalAnswerCustomId = "qna_new_modal_answer";

const UniqueViolationPostgresError = "23505";

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

  if (question == null || question.trim() == "") {
    return ChatMessageResponse("Question field must not be empty.", InteractionResponseFlags.EPHEMERAL);
  }
  if (answer == "error" || answer == null || answer.trim() == "") {
    return ChatMessageResponse("Answer field must not be empty.", InteractionResponseFlags.EPHEMERAL);
  }

  const insertResult = await supabase
    .from("qna")
    .insert(
      {
        guild_id: interaction.guild_id,
        question: question,
        answer: answer,
      },
    )
    .select()
    .single();

  if (insertResult.error) {
    if (insertResult.error.code == UniqueViolationPostgresError) {
      return ChatMessageResponse(`Question "${question}" already exists.`, InteractionResponseFlags.EPHEMERAL);
    }
    console.error(insertResult.error);
    return ChatMessageResponse("Something went wrong.", InteractionResponseFlags.EPHEMERAL);
  }

  return ChatMessageResponse(
    `New question "${insertResult.data.question}" has been added.\n\n${insertResult.data.answer}`,
  );
}
