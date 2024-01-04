import { InteractionResponse, InteractionResponseType, MessageFlags } from "../types/interaction-response-types.ts";

export function ChatMessageResponse(text: string, flags: MessageFlags | undefined = undefined): InteractionResponse {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: text,
      flags: flags,
    },
  };
}
