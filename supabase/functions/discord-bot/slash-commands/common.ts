import { InteractionResponseFlags, InteractionResponseType } from "npm:slash-create";
import { InteractionResponseReply } from "../types/my-types.ts";

export function ChatMessageResponse(
  text: string,
  flags: InteractionResponseFlags | undefined = undefined,
): InteractionResponseReply {
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: text,
      flags: flags,
    },
  };
}
