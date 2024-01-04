import { CommandInteraction } from "../types/types.ts";
import { InteractionResponse, MessageFlags } from "../types/interaction-response-types.ts";
import { ChatMessageResponse } from "./common.ts";

export function handleCommandNotFound(_interaction: CommandInteraction): InteractionResponse {
  return ChatMessageResponse(
    "If you see this command then probably command you actually requested is not implemented yet.",
    MessageFlags.Ephemeral,
  );
}
