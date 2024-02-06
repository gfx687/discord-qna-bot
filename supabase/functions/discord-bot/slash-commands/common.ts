import {
  CommandOptionType,
  CommandStringOption,
  GuildCommandAutocompleteRequestData,
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
  interaction: InteractionRequestData | GuildCommandAutocompleteRequestData,
  name: string,
): CommandStringOption | undefined {
  return interaction.data?.options?.find((option) => option.name === name && option.type == CommandOptionType.STRING) as
    | CommandStringOption
    | undefined;
}

export function groupBy<T>(arr: T[], keyPicker: (item: T) => string): Record<string, T[]> {
  return arr.reduce<Record<string, T[]>>((acc, curr) => {
    const groupKey = keyPicker(curr);
    acc[groupKey] = acc[groupKey] || [];
    acc[groupKey].push(curr);
    return acc;
  }, {});
}
