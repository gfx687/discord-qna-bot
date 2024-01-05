import { InteractionResponse, MessageFlags } from "../types/interaction-response-types.ts";
import { CommandInteraction } from "../types/types.ts";
import { ChatMessageResponse } from "./common.ts";
import acronymsData from "./acronyms-data.ts";

/**
 * Handler for /acronym command created specifically for DRG discord
 */
export function handleAcronymSearch(interaction: CommandInteraction): InteractionResponse {
  const option = interaction.data.options.find((option) => option.name === "acronym");
  if (option == null || option.value == null || option.value.trim() == "") {
    return ChatMessageResponse("Invalid input or something went wrong.", MessageFlags.Ephemeral);
  }

  const matches = acronymsData.filter((x) => x.name.toLowerCase() == option.value.toLowerCase());
  if (matches.length == 0) {
    return ChatMessageResponse(`No acronyms matching ${option.value} found.`, MessageFlags.Ephemeral);
  }

  const content = matches
    .map((x) => `${x.fullName} - ${x.type} for ${x.class}'s ${x.weaponName}`)
    .join("\n");

  return ChatMessageResponse(`Found definitions for "${option.value}":\n\n${content}`);
}
