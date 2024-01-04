import {
  MessageComponentActionRow,
  MessageComponentTextInputStyle,
  MessageComponentType,
} from "../types/message-component-types.ts";
import { CommandInteraction, ModalSubmitInteraction } from "../types/types.ts";
import { InteractionResponse, InteractionResponseType, MessageFlags } from "../types/interaction-response-types.ts";
import { supabase } from "../../_shared/supabaseClient.ts";
import { ChatMessageResponse } from "./common.ts";

export const NewQuestionModalCustomId = "qna_new_modal";
const NewQuestionModalQuestionCustomId = "qna_new_modal_question";
const NewQuestionModalAnswerCustomId = "qna_new_modal_answer";

const UniqueViolationPostgresError = "23505";

export function handleQnaNewCommand(_interaction: CommandInteraction): InteractionResponse {
  return {
    type: InteractionResponseType.Modal,
    data: {
      custom_id: NewQuestionModalCustomId,
      title: "New question",
      components: [
        {
          type: MessageComponentType.ActionRow,
          components: [
            {
              type: MessageComponentType.TextInput,
              style: MessageComponentTextInputStyle.Short,
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
          type: MessageComponentType.ActionRow,
          components: [
            {
              type: MessageComponentType.TextInput,
              style: MessageComponentTextInputStyle.Paragraph,
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

export async function handleQnaNewModalSubmit(interaction: ModalSubmitInteraction): Promise<InteractionResponse> {
  let question: string | undefined;
  let answer: string | undefined;

  const actionRows = interaction.data.components.map((x) => x as MessageComponentActionRow);
  for (const actionRow of actionRows) {
    for (const textInput of actionRow.components) {
      if (textInput.type == MessageComponentType.TextInput && textInput.custom_id == NewQuestionModalQuestionCustomId) {
        question = textInput.value;
      }
      if (textInput.type == MessageComponentType.TextInput && textInput.custom_id == NewQuestionModalAnswerCustomId) {
        answer = textInput.value;
      }
    }
  }

  if (question == null || question.trim() == "") {
    return ChatMessageResponse("Question field must not be empty.", MessageFlags.Ephemeral);
  }
  if (answer == "error" || answer == null || answer.trim() == "") {
    return ChatMessageResponse("Answer field must not be empty.", MessageFlags.Ephemeral);
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
      return ChatMessageResponse(`Question "${question}" already exists.`, MessageFlags.Ephemeral);
    }
    console.error(insertResult.error);
    return ChatMessageResponse("Something went wrong.", MessageFlags.Ephemeral);
  }

  return ChatMessageResponse(
    `New question "${insertResult.data.question}" has been added.\n\n${insertResult.data.answer}`,
  );
}
