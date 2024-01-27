import {
  CommandOptionType,
  CommandStringOption,
  GuildInteractionRequestData,
  InteractionResponseFlags,
} from "npm:slash-create";
import { supabase } from "../../_shared/supabaseClient.ts";
import { ChatMessageResponse } from "./common.ts";
import { InteractionResponseReply } from "../types/my-types.ts";

export const EditModalCustomId = "qna_edit_modal";
export const EditModalAnswerInputCustomId = "qna_edit_modal_new_answer";

export async function handleQnaDeleteCommand(
  interaction: GuildInteractionRequestData,
): Promise<InteractionResponseReply> {
  const option = interaction.data.options?.find((option) =>
    option.name === "question" && option.type == CommandOptionType.STRING
  ) as CommandStringOption | undefined;
  if (option == null || option.value == null || option.value.trim() == "") {
    return ChatMessageResponse(
      "Question cannot be empty when using delete command.",
      InteractionResponseFlags.EPHEMERAL,
    );
  }

  const { data } = await supabase.from("qna")
    .select()
    .eq("guild_id", interaction.guild_id)
    .eq("question", option.value)
    .maybeSingle();

  if (data == null) {
    return ChatMessageResponse(
      "No question found. Make sure to provide full name of the question, delete command does not allow for ambiguity in search term.",
      InteractionResponseFlags.EPHEMERAL,
    );
  }

  const deleteResult = await supabase.from("qna")
    .delete()
    .eq("guild_id", interaction.guild_id)
    .eq("question", option.value);

  if (deleteResult.error) {
    console.error(deleteResult.error);
    return ChatMessageResponse("Something went wrong.", InteractionResponseFlags.EPHEMERAL);
  }

  return ChatMessageResponse(`Done. Question "${option.value}" has been deleted.`);
}
