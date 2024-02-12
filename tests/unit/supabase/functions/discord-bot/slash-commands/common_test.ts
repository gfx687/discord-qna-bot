import { CommandOptionType, CommandStringOption, InteractionRequestData } from "npm:slash-create";
import { getInteractionOptionString } from "../../../../../../supabase/functions/discord-bot/slash-commands/common.ts";
import { assertEquals } from "https://deno.land/std@0.214.0/assert/assert_equals.ts";

Deno.test("getInteractionOptionString: empty interaction data - should return undefined", () => {
  const res = getInteractionOptionString({} as InteractionRequestData, "option");

  assertEquals(res, undefined);
});

Deno.test("getInteractionOptionString: empty interaction data options - should return undefined", () => {
  const res = getInteractionOptionString({
    data: {},
  } as InteractionRequestData, "option");

  assertEquals(res, undefined);
});

Deno.test("getInteractionOptionString: found option but not string type - should return undefined", () => {
  const res = getInteractionOptionString({
    data: {
      options: [{
        name: "option",
        type: CommandOptionType.BOOLEAN,
      }],
    },
  } as InteractionRequestData, "option");

  assertEquals(res, undefined);
});

Deno.test("getInteractionOptionString: found option - should return it", () => {
  const option = {
    name: "option",
    type: CommandOptionType.STRING,
  } as CommandStringOption;
  const res = getInteractionOptionString({
    data: {
      options: [option],
    },
  } as InteractionRequestData, "option");

  assertEquals(res, option);
});
