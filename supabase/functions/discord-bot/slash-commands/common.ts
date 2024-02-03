import {
  CommandOptionType,
  CommandStringOption,
  InteractionRequestData,
  InteractionResponseFlags,
  InteractionResponseType,
} from "npm:slash-create";
import { InteractionResponseReply } from "../data/discord-types.ts";

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

export function getInteractionOptionString(
  interaction: InteractionRequestData,
  name: string,
): CommandStringOption | undefined {
  return interaction.data?.options?.find((option) => option.name === name && option.type == CommandOptionType.STRING) as
    | CommandStringOption
    | undefined;
}
