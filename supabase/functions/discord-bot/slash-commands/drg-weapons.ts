import {
  GuildCommandAutocompleteRequestData,
  GuildInteractionRequestData,
  InteractionResponseFlags,
  InteractionResponseType,
} from "npm:slash-create";
import { InteractionResponseAutocomplete, InteractionResponseReply } from "../data/discord-types.ts";
import { DRGWeaponInfo } from "../data/drg/weapon-info-types.ts";
import { ChatMessageResponse, getInteractionOptionString, groupBy } from "./common.ts";
import { searchWeaponInfo } from "../data/drg/weapon-info-repository.ts";
import { DRGWeaponModTier } from "../data/drg/common-types.ts";

export async function handleWeaponAutocomplete(
  interaction: GuildCommandAutocompleteRequestData,
): Promise<InteractionResponseAutocomplete> {
  const option = _internal.getInteractionOptionString(interaction, "weapon-name");
  if (option?.value == null || option.value.trim() == "") {
    return {
      type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
      data: { choices: [] },
    };
  }

  const weapons = await _internal.searchWeaponInfo(option.value);

  return {
    type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
    data: {
      choices: weapons.map((x) => ({ name: x.name, value: x.name })),
    },
  };
}

/**
 * Handler for /weapon command for DRG discord
 */
export async function handleDRGWeaponSearch(
  interaction: GuildInteractionRequestData,
): Promise<InteractionResponseReply> {
  const weaponName = _internal.getInteractionOptionString(interaction, "weapon-name");
  if (weaponName?.value == null || weaponName.value.trim() == "") {
    return ChatMessageResponse(
      "Invalid input: weapon name not provided.",
      InteractionResponseFlags.EPHEMERAL,
    );
  }

  const tierOption = _internal.getInteractionOptionString(interaction, "tier");
  const tier = parseTier(tierOption?.value);

  const weapons = await _internal.searchWeaponInfo(weaponName.value);
  if (weapons.length == 0) {
    return ChatMessageResponse(
      `No weapon / tool matching '${weaponName.value}' found.`,
      InteractionResponseFlags.EPHEMERAL,
    );
  }

  const message = buildWeaponInfoMessage(weapons[0], tier);
  return ChatMessageResponse(message);
}

/**
 * Takes DRG weapon and optional tier as an argument and builds weapon mods info message
 *
 * Example:
 *
 * Driller's CRSPR Flamethrower mods:
 *
 * Tier 1:
 * - A - "High Capacity Tanks", +25 Tank Size
 * - B - "High Pressure Ejector", +5m Range
 *
 * Tier 2:
 * - A - "Unfiltered Fuel", +4 Damage per Particle
 * - B - "Triple Filtered Fuel", +10 Hear per Particle
 *
 * ...etc
 */
function buildWeaponInfoMessage(
  weapon: DRGWeaponInfo,
  requestedTier: DRGWeaponModTier | undefined = undefined,
): string {
  let result = `${weapon.class}'s ${weapon.name} mods:`;
  const tiers = groupBy(weapon.mods, (x) => x.tier.toString());

  for (const tier in tiers) {
    if (!(tier in tiers) || requestedTier && tier != requestedTier.toString()) {
      continue;
    }
    result += `\n\nTier ${tier}:`;

    const mods = tiers[tier].toSorted((a, b) => a.position.localeCompare(b.position));
    for (const mod of mods) {
      result += `\n- ${mod.position} - "${mod.name}", ${mod.description}`;
    }
  }

  return result;
}

function parseTier(s: string | undefined): DRGWeaponModTier | undefined {
  if (!s) {
    return undefined;
  }

  s = s.trim();
  switch (s) {
    case "1":
    case "t1":
      return 1;
    case "2":
    case "t2":
      return 2;
    case "3":
    case "t3":
      return 3;
    case "4":
    case "t4":
      return 4;
    case "5":
    case "t5":
      return 5;
    default:
      return undefined;
  }
}

export const _internal = {
  getInteractionOptionString,
  searchWeaponInfo,
};
