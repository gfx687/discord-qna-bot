import { supabase } from "../../_shared/supabaseClient.ts";
import {
  MessageComponentActionRow,
  MessageComponentTextInput,
  MessageComponentTextInputStyle,
  MessageComponentType,
} from "../types/message-component-types.ts";
import { CommandInteraction, ModalSubmitInteraction } from "../types/types.ts";
import { InteractionResponse, InteractionResponseType, MessageFlags } from "../types/interaction-response-types.ts";
import { ChatMessageResponse } from "./common.ts";

export const EditModalCustomId = "qna_edit_modal";
export const EditModalAnswerInputCustomId = "qna_edit_modal_new_answer";

export async function handleQnaEditCommand(interaction: CommandInteraction): Promise<InteractionResponse> {
  const option = interaction.data.options.find((option) => option.name === "question");
  if (option == null || option.value == null || option.value.trim() == "") {
    return ChatMessageResponse("Question cannot be empty when using edit command.", MessageFlags.Ephemeral);
  }

  const { data } = await supabase.from("qna")
    .select()
    .eq("guild_id", interaction.guild_id)
    .eq("question", option.value)
    .maybeSingle();

  if (data == null) {
    return ChatMessageResponse(
      "No question found. Make sure to provide full name of the question, edit command does not allow for ambiguity in search term.",
      MessageFlags.Ephemeral,
    );
  }

  // Save information about edit process to database because when modal is submitted we will not receive information
  // about command that spawned it (meaning we don't know what question user is editing).
  const processId = `${EditModalCustomId}_${crypto.randomUUID()}`;
  const insertResult = await supabase
    .from("qna_edit_processes")
    .insert(
      {
        process_id: processId,
        guild_id: data.guild_id,
        question: data.question,
        started_at: new Date().toISOString(),
      },
    )
    .select();

  if (insertResult.error) {
    console.error(insertResult.error);
    return ChatMessageResponse("Something went wrong.", MessageFlags.Ephemeral);
  }

  return {
    type: InteractionResponseType.Modal,
    data: {
      custom_id: processId,
      title: `Question: "${data.question}"`,
      components: [{
        type: MessageComponentType.ActionRow,
        components: [{
          type: MessageComponentType.TextInput,
          style: MessageComponentTextInputStyle.Paragraph,
          label: "New answer",
          custom_id: EditModalAnswerInputCustomId,
          min_length: 1,
          max_length: 1000,
          placeholder: "placeholder",
          required: true,
          value: data.answer,
        }],
      }],
    },
  };
}

export async function handleQnaEditModalSubmit(interaction: ModalSubmitInteraction): Promise<InteractionResponse> {
  const { data } = await supabase.from("qna_edit_processes")
    .select()
    .eq("process_id", interaction.data.custom_id)
    .maybeSingle();

  if (data == null) {
    return ChatMessageResponse(
      "Question not found. Unless someone deleted it while you were editing something went wrong.",
      MessageFlags.Ephemeral,
    );
  }

  const formInputs = interaction.data.components.find((c) =>
    c.type == MessageComponentType.ActionRow
  ) as MessageComponentActionRow;

  const newAnswer = formInputs.components.find((c) =>
    c.type == MessageComponentType.TextInput && c.custom_id == EditModalAnswerInputCustomId
  ) as MessageComponentTextInput;
  if (newAnswer == null || newAnswer.value == null || newAnswer.value.trim() == "") {
    return ChatMessageResponse("Invalid answer was provided.", MessageFlags.Ephemeral);
  }

  const updateResult = await supabase
    .from("qna")
    .update({ answer: newAnswer.value })
    .eq("guild_id", data.guild_id)
    .eq("question", data.question)
    .select()
    .maybeSingle();
  if (updateResult.data == null || updateResult.error) {
    console.error(updateResult.error);
    return ChatMessageResponse("Something went wrong.", MessageFlags.Ephemeral);
  }

  return ChatMessageResponse(`Saved new answer to question "${data.question}".\n\n${updateResult.data.answer}`);
}
