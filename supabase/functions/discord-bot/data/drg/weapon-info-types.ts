import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { drgClassZod, drgWeaponModPositionZod, drgWeaponModTierZod } from "./common-types.ts";

export const drgWeaponInfoZod = z.object({
  name: z.string(),
  class: drgClassZod,
  mods: z
    .object({
      tier: drgWeaponModTierZod,
      position: drgWeaponModPositionZod,
      name: z.string(),
      description: z.string(),
    })
    .array(),
});

export type DRGWeaponInfo = z.infer<typeof drgWeaponInfoZod>;
