import { ChatMessageResponse } from "./common.ts";
import { acronymsData } from "./acronyms-data.ts";
import { CommandOptionType, CommandStringOption, GuildInteractionRequestData, InteractionResponseFlags } from "npm:slash-create";
import { InteractionResponseReply } from "../types/my-types.ts";

/**
 * Handler for /acronym command created specifically for DRG discord
 */
export function handleAcronymSearch(interaction: GuildInteractionRequestData): InteractionResponseReply {
  const option = interaction.data.options?.find((option) =>
    option.name === "acronym" && option.type == CommandOptionType.STRING
  ) as CommandStringOption | undefined;
  if (option == null || option.value == null || option.value.trim() == "") {
    return ChatMessageResponse("Invalid input or something went wrong.", InteractionResponseFlags.EPHEMERAL);
  }

  const matches = acronymsData.get(option.value.toUpperCase());
  if (!matches) {
    return ChatMessageResponse(`No acronyms matching ${option.value} found.`, InteractionResponseFlags.EPHEMERAL);
  }

  const content = matches
    .map((x) => `${x.fullName} - ${x.type} for ${x.class}'s ${x.weaponName}`)
    .join("\n");

  return ChatMessageResponse(`Found definitions for "${option.value}":\n\n${content}`);
}
