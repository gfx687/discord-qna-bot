import { handleHelloCommand } from "./slash-commands/hello.ts";
import { handleQnaAutocomplete, handleQnaCommand } from "./slash-commands/qna.ts";
import { Interaction, InteractionResponse, InteractionResponseType } from "./types.ts";

export async function handleCommands(interaction: Interaction): Promise<InteractionResponse> {
  let result: InteractionResponse;
  switch (interaction.data.name) {
    case "qna":
      result = await handleQnaCommand(interaction);
      break;
    default:
      result = handleHelloCommand(interaction);
      break;
  }
  
  return result;
}

export async function handleAutocomplete(interaction: Interaction): Promise<InteractionResponse> {
  let result: InteractionResponse;
  switch (interaction.data.name) {
    case "qna":
      result = await handleQnaAutocomplete(interaction);
      break;
    default:
      result = {
        type: InteractionResponseType.ApplicationCommandAutocompleteResult,
        data: { choices: [] },
      };
  }

  return result;
}
