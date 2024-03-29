import { ChatMessageResponse, getInteractionOptionString } from "./common.ts";
import { GuildInteractionRequestData, InteractionResponseFlags } from "npm:slash-create";
import { InteractionResponseReply } from "../data/discord-types.ts";
import { getAcronyms } from "../data/acronym-repository.ts";
import { Acronym, acronymToString, acronymTypeToString } from "../data/acronym-types.ts";
import { searchQuestions } from "../data/question-repository.ts";
import { groupBy } from "./common.ts";

/**
 * Handler for /acronym command created specifically for DRG discord
 * If requested acronym not found search /qna too
 */
export async function handleAcronymSearch(
  interaction: GuildInteractionRequestData,
): Promise<InteractionResponseReply> {
  const option = _internal.getInteractionOptionString(interaction, "acronym");
  if (option?.value == null || option.value.trim() == "") {
    return ChatMessageResponse(
      "Invalid input or something went wrong.",
      InteractionResponseFlags.EPHEMERAL,
    );
  }

  const acronyms = await _internal.getAcronyms(interaction.guild_id, option.value);
  if (acronyms.length > 0) {
    const message = buildAcronymMessage(acronyms);
    return ChatMessageResponse(message);
  }

  const questions = await _internal.searchQuestions(interaction.guild_id, option.value);
  if (questions.length > 0) {
    return ChatMessageResponse(questions[0].answer);
  }

  return ChatMessageResponse(
    `No acronyms matching '${option.value.toUpperCase()}' found.`,
    InteractionResponseFlags.EPHEMERAL,
  );
}

/**
 * Takes a list of Acronyms and builds a message from them.
 *
 * Example:
 *
 * Found definitions for ER:
 *
 * Overclocks:
 * - Elecrifying Reload - Scout's GK2
 * - Explosive Reload - Driller's Subata 120
 *
 * Weapon Mods:
 * - Exothermic Reactor - t5C for Driller's wave cooker
 */
function buildAcronymMessage(acronyms: Acronym[]): string {
  if (acronyms.length == 0) {
    return "No matches found.";
  }

  const grouped = groupBy(acronyms, ({ acronymType }) => acronymTypeToString(acronymType));

  let message = `Found definitions for '${acronyms[0].acronym}':\n`;
  for (const key in grouped) {
    message += `\n${key}s:\n`;
    for (const acronym of grouped[key]) {
      message += `- ${acronymToString(acronym)}\n`;
    }
  }

  return message;
}

export const _internal = {
  getInteractionOptionString,
  getAcronyms,
  searchQuestions,
};
