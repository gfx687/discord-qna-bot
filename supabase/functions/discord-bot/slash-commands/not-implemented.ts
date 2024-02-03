import { InteractionResponseFlags } from "npm:slash-create";
import { InteractionResponseReply } from "../data/discord-types.ts";
import { ChatMessageResponse } from "./common.ts";

export function handleCommandNotFound(): InteractionResponseReply {
  return ChatMessageResponse(
    "If you see this message then command you requested probably does not exist.",
    InteractionResponseFlags.EPHEMERAL,
  );
}
