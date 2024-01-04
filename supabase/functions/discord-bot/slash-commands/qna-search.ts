import { supabase } from "../../_shared/supabaseClient.ts";
import { CommandInteraction } from "../types/types.ts";
import { InteractionResponse, InteractionResponseType, MessageFlags } from "../types/interaction-response-types.ts";
import { ChatMessageResponse } from "./common.ts";

export async function handleQnaAutocomplete(interaction: CommandInteraction): Promise<InteractionResponse> {
  const option = interaction.data.options.find(
    (option) => option.name === "question" && option.focused,
  );
  if (option?.value == null || option.value.trim() == "") {
    return {
      type: InteractionResponseType.ApplicationCommandAutocompleteResult,
      data: { choices: [] },
    };
  }

  const { data } = await supabase.rpc("search_questions", {
    search_guild_id: interaction.guild_id,
    search_term: option.value,
  });

  return {
    type: InteractionResponseType.ApplicationCommandAutocompleteResult,
    data: {
      choices: data == null ? [] : data.map((x) => ({ name: x.question, value: x.question })),
    },
  };
}

export async function handleQnaCommand(interaction: CommandInteraction): Promise<InteractionResponse> {
  const option = interaction.data.options.find((option) => option.name === "question");
  if (option == null || option.value == null || option.value.trim() == "") {
    return ChatMessageResponse("Invalid question or something went wrong.", MessageFlags.Ephemeral);
  }

  const { data } = await supabase.rpc("search_questions", {
    search_guild_id: interaction.guild_id,
    search_term: option.value,
  });

  if (data == null || data.length == 0) {
    return ChatMessageResponse(`No answers were found for question "${option.value}".`);
  }

  let message = `Your search term: "${option.value}"
Best matched question: "${data[0].question}"`;
  if (data.length > 1) {
    message = message + `\nOther matches found: '${data.slice(1).map((x) => x.question).join(" ; ")}'`;
  }

  return ChatMessageResponse(`${message}.\n\n${data[0].answer}`);
}
