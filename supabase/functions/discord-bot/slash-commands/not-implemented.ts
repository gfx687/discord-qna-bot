import { AnyRequestData, InteractionResponseFlags } from "npm:slash-create";
import { InteractionResponseReply } from "../types/my-types.ts";
import { ChatMessageResponse } from "./common.ts";

export function handleCommandNotFound(_interaction: AnyRequestData): InteractionResponseReply {
  return ChatMessageResponse(
    "If you see this message then command you requested probably does not exist.",
    InteractionResponseFlags.EPHEMERAL,
  );
}
