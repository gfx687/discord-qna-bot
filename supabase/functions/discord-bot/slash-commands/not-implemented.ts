import { CommandInteraction } from "../types/types.ts";
import { InteractionResponse, InteractionResponseType } from "../types/interaction-response-types.ts";

export function handleCommandNotFound(_interaction: CommandInteraction): InteractionResponse {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content: "If you see this command then probably command you actually requested is not implemented yet" },
  };
}
