import { supabase } from "../../_shared/supabaseClient.ts";
import { CommandInteraction } from "../types/types.ts";
import { InteractionResponse, InteractionResponseType, MessageFlags } from "../types/interaction-response-types.ts";

export const EditModalCustomId = "qna_edit_modal";
export const EditModalAnswerInputCustomId = "qna_edit_modal_new_answer";

export async function handleQnaDeleteCommand(interaction: CommandInteraction): Promise<InteractionResponse> {
  const option = interaction.data.options.find((option) => option.name === "question");
  if (option == null || option.value == null || option.value.trim() == "") {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "Question cannot be empty when using delete command.",
        flags: MessageFlags.Ephemeral,
      },
    };
  }

  const { data } = await supabase.from("qna")
    .select()
    .eq("question", option.value)
    .maybeSingle();

  if (data == null) {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content:
          "No question found. Make sure to provide full name of the question, delete command does not allow for ambiguity in search term.",
        flags: MessageFlags.Ephemeral,
      },
    };
  }

  const deleteResult = await supabase.from("qna")
    .delete()
    .eq("question", option.value);

  if (deleteResult.error) {
    console.error(deleteResult.error);
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
    data: { content: `Done. Question "${option.value}" has been deleted.` },
  };
}
