import { supabase } from "../../_shared/supabaseClient.ts";
import { InteractionResponseModal, InteractionResponseReply } from "../data/discord-types.ts";
import { ChatMessageResponse } from "./common.ts";
import {
  CommandOptionType,
  CommandStringOption,
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

export async function handleQnaEditCommand(
  interaction: GuildInteractionRequestData,
): Promise<InteractionResponseReply | InteractionResponseModal> {
  const option = interaction.data.options?.find((option) =>
    option.name === "question" && option.type == CommandOptionType.STRING
  ) as CommandStringOption | undefined;
  if (option == null || option.value == null || option.value.trim() == "") {
    return ChatMessageResponse("Question cannot be empty when using edit command.", InteractionResponseFlags.EPHEMERAL);
  }

  const { data } = await supabase.from("qna")
    .select()
    .eq("guild_id", interaction.guild_id)
    .eq("question", option.value)
    .maybeSingle();

  if (data == null) {
    return ChatMessageResponse(
      "No question found. Make sure to provide full name of the question, edit command does not allow for ambiguity in search term.",
      InteractionResponseFlags.EPHEMERAL,
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
    return ChatMessageResponse("Something went wrong.", InteractionResponseFlags.EPHEMERAL);
  }

  return {
    type: InteractionResponseType.MODAL,
    data: {
      custom_id: processId,
      title: `Question: "${data.question}"`,
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
          value: data.answer,
        }],
      }],
    },
  };
}

export async function handleQnaEditModalSubmit(
  interaction: GuildModalSubmitRequestData,
): Promise<InteractionResponseReply> {
  const { data } = await supabase.from("qna_edit_processes")
    .select()
    .eq("process_id", interaction.data.custom_id)
    .maybeSingle();

  if (data == null) {
    return ChatMessageResponse(
      "Question not found. Unless someone deleted it while you were editing something went wrong.",
      InteractionResponseFlags.EPHEMERAL,
    );
  }

  const formInputs = interaction.data.components.find((c) => c.type == ComponentType.ACTION_ROW) as ComponentActionRow;

  const newAnswer = formInputs.components.find((c) =>
    c.type == ComponentType.TEXT_INPUT && c.custom_id == EditModalAnswerInputCustomId
  ) as ComponentTextInput;
  if (newAnswer == null || newAnswer.value == null || newAnswer.value.trim() == "") {
    return ChatMessageResponse("Invalid answer was provided.", InteractionResponseFlags.EPHEMERAL);
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
    return ChatMessageResponse("Something went wrong.", InteractionResponseFlags.EPHEMERAL);
  }

  return ChatMessageResponse(`Saved new answer to question "${data.question}".\n\n${updateResult.data.answer}`);
}
