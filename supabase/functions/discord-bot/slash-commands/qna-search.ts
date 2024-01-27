import { supabase } from "../../_shared/supabaseClient.ts";
import { InteractionResponseAutocomplete, InteractionResponseReply } from "../types/my-types.ts";
import { ChatMessageResponse } from "./common.ts";
import {
  CommandOptionType,
  CommandStringOption,
  GuildCommandAutocompleteRequestData,
  GuildInteractionRequestData,
  InteractionResponseFlags,
  InteractionResponseType,
} from "npm:slash-create";

export async function handleQnaAutocomplete(
  interaction: GuildCommandAutocompleteRequestData,
): Promise<InteractionResponseAutocomplete> {
  const option = interaction.data.options.find(
    (option) => option.name === "question" && option.type == CommandOptionType.STRING && option.focused,
  ) as CommandStringOption | undefined;
  if (option?.value == null || option.value.trim() == "") {
    return {
      type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
      data: { choices: [] },
    };
  }

  const { data } = await supabase.rpc("search_questions", {
    search_guild_id: interaction.guild_id,
    search_term: option.value,
  });

  return {
    type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
    data: {
      choices: data == null ? [] : data.map((x) => ({ name: x.question, value: x.question })),
    },
  };
}

export async function handleQnaCommand(
  interaction: GuildInteractionRequestData,
): Promise<InteractionResponseReply> {
  const option = interaction.data.options?.find((option) =>
    option.name === "question" && option.type == CommandOptionType.STRING
  ) as CommandStringOption | undefined;
  if (option == null || option.value == null || option.value.trim() == "") {
    return ChatMessageResponse("Invalid question or something went wrong.", InteractionResponseFlags.EPHEMERAL);
  }

  const { data } = await supabase.rpc("search_questions", {
    search_guild_id: interaction.guild_id,
    search_term: option.value,
  });

  if (data == null || data.length == 0) {
    return ChatMessageResponse(`No answers were found for question "${option.value}".`);
  }

  return ChatMessageResponse(data[0].answer);
}
