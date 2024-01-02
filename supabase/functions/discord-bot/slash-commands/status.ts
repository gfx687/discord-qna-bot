import {
  Interaction,
  InteractionResponse,
  InteractionResponseType,
} from "../types.ts";

export function handleStatusCommand(_interaction: Interaction): InteractionResponse {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content: 'status command handled' },
  };
}

