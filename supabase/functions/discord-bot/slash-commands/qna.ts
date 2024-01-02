import { supabase } from "../../_shared/supabaseClient.ts";
import { Interaction, InteractionResponse, InteractionResponseType } from "../types.ts";

// TODO: search_questions function optimization - order by
// TODO: search_questions add search of words in the middle of the string (tsvector probably)

export async function handleQnaCommand(interaction: Interaction): Promise<InteractionResponse> {
  const option = interaction.data.options.find((option) => option.name === "question");
  if (option == null || option.value == null || option.value.trim() == "") {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: { content: `Invalid question or something went wrong.` },
    };
  }

  const { data } = await supabase
    .rpc("search_questions", { search_guild_id: interaction.guild_id, search_term: option.value });

  if (data == null || data.length == 0) {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: { content: `No answers found to your question "${option.value}".` },
    };
  }

  let message = `Your search term: "${option.value}"
Best matched question: "${data[0].question}"`;
  if (data.length > 1) {
    message = message + `\nOther matches found: '${data.slice(1).map((x) => x.question).join(" ; ")}'`;
  }

  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `${message}.\n\n${data[0].answer}`,
    },
  };
}

export async function handleQnaAutocomplete(interaction: Interaction): Promise<InteractionResponse> {
  const option = interaction.data.options.find(
    (option) => option.name === "question" && option.focused,
  );
  if (option == null || option.value == null || option.value.trim() == "") {
    return {
      type: InteractionResponseType.ApplicationCommandAutocompleteResult,
      data: { choices: [] },
    };
  }

  const { data } = await supabase
    .rpc("search_questions", { search_guild_id: interaction.guild_id, search_term: option.value });

  if (data == null || data.length == 0) {
    return {
      type: InteractionResponseType.ApplicationCommandAutocompleteResult,
      data: { choices: [] },
    };
  }

  return {
    type: InteractionResponseType.ApplicationCommandAutocompleteResult,
    data: {
      choices: data.map((x) => ({ name: x.question, value: x.question })),
    },
  };
}