import sql from "../db.ts";
import { DRGWeaponInfo, drgWeaponInfoZod } from "./weapon-info-types.ts";

export async function getWeaponInfo(weaponName: string): Promise<DRGWeaponInfo | undefined> {
  const weaponInfo = await sql`
        select *
        from drg_weapons_info
        where name = ${weaponName};`;

  return weaponInfo.count == 0 ? undefined : drgWeaponInfoZod.parse(weaponInfo[0]);
}

export async function searchWeaponInfo(term: string): Promise<DRGWeaponInfo[]> {
  term = term.trim();
  const weapons = await sql`
        select *
        from drg_weapons_info
        where replace(name, '"', '') ilike ${term + "%"}
            or replace(name, '"', '') ilike ${"% " + term + "%"}
            or ${term} = any(search_terms)
    `;

  return weapons.count == 0 ? [] : drgWeaponInfoZod.array().parse(weapons);
}
