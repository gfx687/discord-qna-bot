import { InteractionResponseFlags } from "npm:slash-create";
import { InteractionResponseReply } from "../data/discord-types.ts";
import { ChatMessageResponse } from "./common.ts";

export function handleQnaHelp(): InteractionResponseReply {
  return ChatMessageResponse(
    "See list of commands and example of usage with pictures [here](<https://github.com/gfx687/discord-qna-bot/blob/main/docs/user-guide.md#global-bot-commands>).",
    InteractionResponseFlags.EPHEMERAL,
  );
}
