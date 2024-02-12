import { resolvesNext, returnsNext, stub } from "https://deno.land/std@0.214.0/testing/mock.ts";
import {
  _internal,
  handleDRGWeaponSearch,
} from "../../../../../../supabase/functions/discord-bot/slash-commands/drg-weapons.ts";
import { handleWeaponAutocomplete } from "../../../../../../supabase/functions/discord-bot/slash-commands/drg-weapons.ts";
import {
  CommandStringOption,
  GuildCommandAutocompleteRequestData,
  GuildInteractionRequestData,
  InteractionResponseFlags,
  InteractionResponseType,
} from "npm:slash-create";
import { assertEquals } from "https://deno.land/std@0.132.0/testing/asserts.ts";
import { DRGWeaponInfo } from "../../../../../../supabase/functions/discord-bot/data/drg/weapon-info-types.ts";

Deno.test("handleWeaponAutocomplete: empty search term - should return empty result", async (t) => {
  const test = (param: any) => async () => {
    const getOptionStub = stub(_internal, "getInteractionOptionString", returnsNext([param]));

    try {
      const res = await handleWeaponAutocomplete({} as GuildCommandAutocompleteRequestData);

      assertEquals(res.type, InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT);
      assertEquals(res.data.choices.length, 0);
    } finally {
      getOptionStub.restore();
    }
  };

  await t.step("option is undefined", test(undefined));
  await t.step("option's value is undefined", test({ value: undefined }));
  await t.step("option's value is empty spaces", test({ value: "  " }));
});

Deno.test("handleWeaponAutocomplete: weapon info found - should return expected autocomplete options", async () => {
  const getOptionStub = stub(
    _internal,
    "getInteractionOptionString",
    returnsNext([{ value: "valid" } as CommandStringOption]),
  );
  const searchWeaponStub = stub(
    _internal,
    "searchWeaponInfo",
    resolvesNext([[
      { name: "weapon-1" },
      { name: "weapon-2" },
    ] as DRGWeaponInfo[]]),
  );

  try {
    const res = await handleWeaponAutocomplete({} as GuildCommandAutocompleteRequestData);

    assertEquals(res.type, InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT);
    assertEquals(res.data.choices.length, 2);
    assertEquals(res.data.choices[0], {
      name: "weapon-1",
      value: "weapon-1",
    });
    assertEquals(res.data.choices[1], {
      name: "weapon-2",
      value: "weapon-2",
    });
  } finally {
    getOptionStub.restore();
    searchWeaponStub.restore();
  }
});

Deno.test("handleWeaponAutocomplete: weapon info not found - should return empty autocomplete options", async () => {
  const getOptionStub = stub(
    _internal,
    "getInteractionOptionString",
    returnsNext([{ value: "valid" } as CommandStringOption]),
  );
  const searchWeaponStub = stub(_internal, "searchWeaponInfo", resolvesNext([[] as DRGWeaponInfo[]]));

  try {
    const res = await handleWeaponAutocomplete({} as GuildCommandAutocompleteRequestData);

    assertEquals(res.type, InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT);
    assertEquals(res.data.choices.length, 0);
  } finally {
    getOptionStub.restore();
    searchWeaponStub.restore();
  }
});

Deno.test("handleDRGWeaponSearch: empty search term - should return error message", async (t) => {
  const test = (param: any) => async () => {
    const getOptionStub = stub(_internal, "getInteractionOptionString", returnsNext([param]));

    try {
      const res = await handleDRGWeaponSearch({} as GuildInteractionRequestData);

      assertEquals(res.data.content, "Invalid input: weapon name not provided.");
      assertEquals(res.data.flags, InteractionResponseFlags.EPHEMERAL);
    } finally {
      getOptionStub.restore();
    }
  };

  await t.step("option is undefined", test(undefined));
  await t.step("option's value is undefined", test({ value: undefined }));
  await t.step("option's value is empty spaces", test({ value: "  " }));
});

Deno.test("handleDRGWeaponSearch: no weapons found - should return not found message", async () => {
  const getOptionStub = stub(
    _internal,
    "getInteractionOptionString",
    returnsNext([
      { value: "valid-weapon" },
      undefined,
    ] as CommandStringOption[]),
  );
  const searchWeaponStub = stub(_internal, "searchWeaponInfo", resolvesNext([[]]));

  try {
    const res = await handleDRGWeaponSearch({} as GuildInteractionRequestData);

    assertEquals(res.data.content, "No weapon / tool matching 'valid-weapon' found.");
    assertEquals(res.data.flags, InteractionResponseFlags.EPHEMERAL);
  } finally {
    getOptionStub.restore();
    searchWeaponStub.restore();
  }
});

Deno.test("handleDRGWeaponSearch: weapons found and no tier provided - should return first weapon's full description", async (t) => {
  const test = (tier: any) => async () => {
    const expectedMessage = `Scout's valid-weapon-1 mods:

Tier 1:
- A - "weapon1-mod-1A", weapon1-mod-1A-description
- B - "weapon1-mod-1B", weapon1-mod-1B-description

Tier 2:
- A - "weapon1-mod-2A", weapon1-mod-2A-description`;
    const weapons = [{
      name: "valid-weapon-1",
      class: "Scout",
      mods: [{
        tier: 1,
        position: "A",
        name: "weapon1-mod-1A",
        description: "weapon1-mod-1A-description",
      }, {
        tier: 1,
        position: "B",
        name: "weapon1-mod-1B",
        description: "weapon1-mod-1B-description",
      }, {
        tier: 2,
        position: "A",
        name: "weapon1-mod-2A",
        description: "weapon1-mod-2A-description",
      }],
    }, {
      name: "valid-weapon-2",
      class: "Scout",
      mods: [{
        tier: 1,
        position: "A",
        name: "weapon2-mod-1A",
        description: "weapon2-mod-1A-description",
      }],
    }] as DRGWeaponInfo[];

    const getOptionStub = stub(
      _internal,
      "getInteractionOptionString",
      returnsNext([
        { value: "valid-weapon" },
        tier,
      ] as CommandStringOption[]),
    );
    const searchWeaponStub = stub(_internal, "searchWeaponInfo", resolvesNext([weapons]));

    try {
      const res = await handleDRGWeaponSearch({} as GuildInteractionRequestData);

      assertEquals(res.data.content, expectedMessage);
    } finally {
      getOptionStub.restore();
      searchWeaponStub.restore();
    }
  };

  await t.step("tier not provided", test(undefined));
  await t.step("tier is invalid", test({ value: "some invalid tier string" }));
});

Deno.test("handleDRGWeaponSearch: weapons found and tier provided - should return first weapon's requested tier", async (t) => {
  const test = (tier: any, expectedMessage: string) => async () => {
    const weapons = [{
      name: "valid-weapon-1",
      class: "Scout",
      mods: [{
        tier: 1,
        position: "A",
        name: "weapon1-mod-1A",
        description: "weapon1-mod-1A-description",
      }, {
        tier: 1,
        position: "B",
        name: "weapon1-mod-1B",
        description: "weapon1-mod-1B-description",
      }, {
        tier: 2,
        position: "A",
        name: "weapon1-mod-2A",
        description: "weapon1-mod-2A-description",
      }],
    }, {
      name: "valid-weapon-2",
      class: "Scout",
      mods: [{
        tier: 1,
        position: "A",
        name: "weapon2-mod-1A",
        description: "weapon2-mod-1A-description",
      }],
    }] as DRGWeaponInfo[];

    const getOptionStub = stub(
      _internal,
      "getInteractionOptionString",
      returnsNext([
        { value: "valid-weapon" },
        tier,
      ] as CommandStringOption[]),
    );
    const searchWeaponStub = stub(_internal, "searchWeaponInfo", resolvesNext([weapons]));

    try {
      const res = await handleDRGWeaponSearch({} as GuildInteractionRequestData);

      assertEquals(res.data.content, expectedMessage);
    } finally {
      getOptionStub.restore();
      searchWeaponStub.restore();
    }
  };

  const expectedMessageForTier1 = `Scout's valid-weapon-1 mods:

Tier 1:
- A - "weapon1-mod-1A", weapon1-mod-1A-description
- B - "weapon1-mod-1B", weapon1-mod-1B-description`;

  await t.step("tier format '1' - should return tier 1 info", test({ value: "1" }, expectedMessageForTier1));
  await t.step("tier format 't1' - should return tier 1 info", test({ value: "t1" }, expectedMessageForTier1));

  const expectedMessageForTier2 = `Scout's valid-weapon-1 mods:

Tier 2:
- A - "weapon1-mod-2A", weapon1-mod-2A-description`;

  await t.step("tier format '2' - should return tier 2 info", test({ value: "2" }, expectedMessageForTier2));
  await t.step("tier format 't2' - should return tier 2 info", test({ value: "t2" }, expectedMessageForTier2));

  const expectedMessageForInvalidTier = `Scout's valid-weapon-1 mods:

Tier 1:
- A - "weapon1-mod-1A", weapon1-mod-1A-description
- B - "weapon1-mod-1B", weapon1-mod-1B-description

Tier 2:
- A - "weapon1-mod-2A", weapon1-mod-2A-description`;

  await t.step(
    "tier format 'invalid-format' - should return all tiers info",
    test({ value: "invalid-format" }, expectedMessageForInvalidTier),
  );
});
