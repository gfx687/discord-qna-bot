import { resolvesNext, returnsNext, stub } from "https://deno.land/std@0.214.0/testing/mock.ts";
import { CommandStringOption, GuildInteractionRequestData, InteractionResponseFlags } from "npm:slash-create";
import { assertEquals } from "https://deno.land/std@0.132.0/testing/asserts.ts";
import {
  _internal,
  handleAcronymSearch,
} from "../../../../../../supabase/functions/discord-bot/slash-commands/acronyms.ts";
import { Acronym } from "../../../../../../supabase/functions/discord-bot/data/acronym-types.ts";
import { Question } from "../../../../../../supabase/functions/discord-bot/data/question-types.ts";
import { AcronymType } from "../../../../../../supabase/functions/discord-bot/data/acronym-types.ts";

Deno.test("no search term provided - should return Invalid input", async () => {
  const getOptionStub = stub(_internal, "getInteractionOptionString", returnsNext([undefined]));

  try {
    const res = await handleAcronymSearch({} as GuildInteractionRequestData);

    assertEquals(res.data.content, "Invalid input or something went wrong.");
    assertEquals(res.data.flags, InteractionResponseFlags.EPHEMERAL);
  } finally {
    getOptionStub.restore();
  }
});

Deno.test("acronyms found - should return expected message", async () => {
  const acronym = "umc".toUpperCase();
  const expectedMessage = `Found definitions for '${acronym}':

Overclocks:
- oc-name - Scout's weapon-name

Weapon Mods:
- mod-name - t1A for Gunner's weapon-name-2
`;
  const acronyms: Acronym[] = [{
    id: 1,
    acronym: acronym,
    guildId: "guild-id",
    acronymType: AcronymType.DRGOverclock,
    payload: {
      overclockName: "oc-name",
      class: "Scout",
      weaponName: "weapon-name",
    },
  }, {
    id: 2,
    acronym: acronym,
    guildId: "guild-id",
    acronymType: AcronymType.DRGWeaponMod,
    payload: {
      class: "Gunner",
      weaponName: "weapon-name-2",
      tier: 1,
      position: "A",
      modName: "mod-name",
    },
  }];

  const getOptionStub = stub(
    _internal,
    "getInteractionOptionString",
    returnsNext([{ value: acronym } as CommandStringOption]),
  );
  const getAcronymsStub = stub(_internal, "getAcronyms", resolvesNext([acronyms]));

  try {
    const res = await handleAcronymSearch({} as GuildInteractionRequestData);

    assertEquals(res.data.content, expectedMessage);
    assertEquals(res.data.flags, undefined);
  } finally {
    getOptionStub.restore();
    getAcronymsStub.restore();
  }
});

Deno.test("acronyms not found but questions found - should return first question's answer", async () => {
  const questions: Question[] = [{
    question: "question-1",
    answer: "answer-1",
    guildId: "1",
  }, {
    question: "question-2",
    answer: "answer-2",
    guildId: "2",
  }];

  const getOptionStub = stub(
    _internal,
    "getInteractionOptionString",
    returnsNext([{ value: "acronym" } as CommandStringOption]),
  );
  const getAcronymsStub = stub(_internal, "getAcronyms", resolvesNext([[] as Acronym[]]));
  const getQuestionsStub = stub(_internal, "searchQuestions", resolvesNext([questions]));

  try {
    const res = await handleAcronymSearch({} as GuildInteractionRequestData);

    assertEquals(res.data.content, "answer-1");
    assertEquals(res.data.flags, undefined);
  } finally {
    getOptionStub.restore();
    getAcronymsStub.restore();
    getQuestionsStub.restore();
  }
});

Deno.test("neither acronyms nor questions found - should return No match", async () => {
  const acronym = "acronym".toUpperCase();
  const getOptionStub = stub(
    _internal,
    "getInteractionOptionString",
    returnsNext([{ value: acronym } as CommandStringOption]),
  );
  const getAcronymsStub = stub(_internal, "getAcronyms", resolvesNext([[] as Acronym[]]));
  const getQuestionsStub = stub(_internal, "searchQuestions", resolvesNext([[] as Question[]]));

  try {
    const res = await handleAcronymSearch({} as GuildInteractionRequestData);

    assertEquals(res.data.content, `No acronyms matching '${acronym}' found.`);
    assertEquals(res.data.flags, InteractionResponseFlags.EPHEMERAL);
  } finally {
    getOptionStub.restore();
    getAcronymsStub.restore();
    getQuestionsStub.restore();
  }
});
