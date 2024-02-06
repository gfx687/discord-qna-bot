import z from "https://deno.land/x/zod@v3.22.4/index.ts";

export const drgClassZod = z.union([
  z.literal("Scout"),
  z.literal("Engineer"),
  z.literal("Gunner"),
  z.literal("Driller"),
]);

export type DRGClass = z.infer<typeof drgClassZod>;

export const drgWeaponModTierZod = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

export type DRGWeaponModTier = z.infer<typeof drgWeaponModTierZod>;

export const drgWeaponModPositionZod = z.union([
  z.literal("A"),
  z.literal("B"),
  z.literal("C"),
]);

export type DRGWeaponModPosition = z.infer<typeof drgWeaponModPositionZod>;
