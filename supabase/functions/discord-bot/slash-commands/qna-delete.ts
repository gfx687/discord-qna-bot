import { supabase } from "../../_shared/supabaseClient.ts";
import { CommandInteraction } from "../types/types.ts";
import { InteractionResponse, MessageFlags } from "../types/interaction-response-types.ts";
import { ChatMessageResponse } from "./common.ts";

export const EditModalCustomId = "qna_edit_modal";
export const EditModalAnswerInputCustomId = "qna_edit_modal_new_answer";

export async function handleQnaDeleteCommand(interaction: CommandInteraction): Promise<InteractionResponse> {
  const option = interaction.data.options.find((option) => option.name === "question");
  if (option == null || option.value == null || option.value.trim() == "") {
    return ChatMessageResponse("Question cannot be empty when using delete command.", MessageFlags.Ephemeral);
  }

  const { data } = await supabase.from("qna")
    .select()
    .eq("guild_id", interaction.guild_id)
    .eq("question", option.value)
    .maybeSingle();

  if (data == null) {
    return ChatMessageResponse(
      "No question found. Make sure to provide full name of the question, delete command does not allow for ambiguity in search term.",
      MessageFlags.Ephemeral,
    );
  }

  const deleteResult = await supabase.from("qna")
    .delete()
    .eq("guild_id", interaction.guild_id)
    .eq("question", option.value);

  if (deleteResult.error) {
    console.error(deleteResult.error);
    return ChatMessageResponse("Something went wrong.", MessageFlags.Ephemeral);
  }

  return ChatMessageResponse(`Done. Question "${option.value}" has been deleted.`);
}
