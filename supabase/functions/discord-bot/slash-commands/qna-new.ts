import {
  MessageComponentActionRow,
  MessageComponentTextInputStyle,
  MessageComponentType,
} from "../types/message-component-types.ts";
import { CommandInteraction, ModalSubmitInteraction } from "../types/types.ts";
import { InteractionResponse, InteractionResponseType, MessageFlags } from "../types/interaction-response-types.ts";
import { supabase } from "../../_shared/supabaseClient.ts";

export const NewQuestionModalCustomId = "qna_new_modal";
export const NewQuestionModalQuestionCustomId = "qna_new_modal_question";
export const NewQuestionModalAnswerCustomId = "qna_new_modal_answer";

export function handleQnaNewCommand(_interaction: CommandInteraction): InteractionResponse {
  return {
    type: InteractionResponseType.Modal,
    data: {
      custom_id: NewQuestionModalCustomId,
      title: "Creating new question",
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
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "Question field cannot be empty",
        flags: MessageFlags.Ephemeral,
      },
    };
  }
  if (answer == "error" || answer == null || answer.trim() == "") {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "Answer field cannot be empty",
        flags: MessageFlags.Ephemeral,
      },
    };
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
    console.error(insertResult.error);
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "Something went wrong.",
        flags: MessageFlags.Ephemeral,
      },
    };
  }

  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `New question "${insertResult.data.question}" has been added.\n\n${insertResult.data.answer}`,
    },
  };
}
