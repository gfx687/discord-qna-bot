export enum AcronymType {
  Term = "term",
  DRGOverclock = "drg-overclock",
  DRGWeaponMod = "drg-weapon-mod",
}

export type Acronym =
  | AcronymDRGOverclock
  | AcronymDRGWeaponMod
  | AcronymTerm;

export type AcronymCommon = {
  id: number;
  acronym: string;
  guildId: string;
};

export type AcronymTerm = AcronymCommon & {
  acronymType: AcronymType.Term;
  payload: {
    fullName: string;
    definition: string;
  };
};

export type AcronymDRGOverclock = AcronymCommon & {
  acronymType: AcronymType.DRGOverclock;
  payload: {
    overclockName: string;
    class: "Scout" | "Engineer" | "Gunner" | "Driller";
    weaponName: string;
  };
};

export type AcronymDRGWeaponMod = AcronymCommon & {
  acronymType: AcronymType.DRGWeaponMod;
  payload: {
    weaponModName: string;
    tier: 1 | 2 | 3 | 4 | 5;
    position: "A" | "B" | "C";
    class: "Scout" | "Engineer" | "Gunner" | "Driller";
    weaponName: string;
  };
};

export function acronymToString(acronym: Acronym): string {
  switch (acronym.acronymType) {
    case AcronymType.Term:
      return `${acronym.payload.fullName} - ${acronym.payload.definition}`;
    case AcronymType.DRGOverclock:
      return `${acronym.payload.overclockName} - ${acronym.payload.class}'s ${acronym.payload.weaponName}`;
    case AcronymType.DRGWeaponMod: {
      const tierInfo = `t${acronym.payload.tier}${acronym.payload.position}`;
      return `${acronym.payload.weaponModName} - ${tierInfo} for ${acronym.payload.class}'s ${acronym.payload.weaponName}`;
    }
    default: {
      throw new Error(`Unknown AcronymType in ${acronym}`);
    }
  }
}

export function acronymTypeToString(type: AcronymType): string {
  switch (type) {
    case AcronymType.Term:
      return "Term";
    case AcronymType.DRGOverclock:
      return "Overclock";
    case AcronymType.DRGWeaponMod:
      return "Weapon Mod";
    default:
      throw new Error(`Unknown AcronymType: '${type}'`);
  }
}
