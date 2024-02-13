import { resolvesNext, returnsNext, stub } from "https://deno.land/std@0.214.0/testing/mock.ts";
import {
  _internal,
  handleQnaAutocomplete,
  handleQnaCommand,
} from "../../../../../../supabase/functions/discord-bot/slash-commands/qna-search.ts";
import {
  CommandStringOption,
  GuildCommandAutocompleteRequestData,
  GuildInteractionRequestData,
  InteractionResponseFlags,
  InteractionResponseType,
} from "npm:slash-create";
import { assertEquals } from "https://deno.land/std@0.132.0/testing/asserts.ts";
import { Question } from "../../../../../../supabase/functions/discord-bot/data/question-types.ts";

Deno.test("handleQnaAutocomplete: search term not valid - should return empty result", async (t) => {
  const test = (param: any) => async () => {
    const getOptionStub = stub(_internal, "getInteractionOptionString", returnsNext([param]));

    try {
      const res = await handleQnaAutocomplete({} as GuildCommandAutocompleteRequestData);

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

Deno.test("handleQnaAutocomplete: questions found - should return options", async () => {
  const questions = [{
    question: "test-question-1",
    answer: "test-answer-1",
    guildId: "test-guildId-1",
  }, {
    question: "test-question-2",
    answer: "test-answer-2",
    guildId: "test-guildId-2",
  }] as Question[];

  const getOptionStub = stub(
    _internal,
    "getInteractionOptionString",
    returnsNext([{ value: "test-option" } as CommandStringOption]),
  );
  const searchQuestionsStub = stub(_internal, "searchQuestions", resolvesNext([questions]));

  try {
    const res = await handleQnaAutocomplete({} as GuildCommandAutocompleteRequestData);

    assertEquals(res.type, InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT);
    assertEquals(res.data.choices.length, 2);
    assertEquals(res.data.choices[0], {
      name: "test-question-1",
      value: "test-question-1",
    });
    assertEquals(res.data.choices[1], {
      name: "test-question-2",
      value: "test-question-2",
    });
  } finally {
    getOptionStub.restore();
    searchQuestionsStub.restore();
  }
});

Deno.test("handleQnaCommand: search term not valid - should return error message", async (t) => {
  const test = (param: any) => async () => {
    const getOptionStub = stub(_internal, "getInteractionOptionString", returnsNext([param]));

    try {
      const res = await handleQnaCommand({} as GuildInteractionRequestData);

      assertEquals(res.data.content, "Invalid question or something went wrong.");
      assertEquals(res.data.flags, InteractionResponseFlags.EPHEMERAL);
    } finally {
      getOptionStub.restore();
    }
  };

  await t.step("option is undefined", test(undefined));
  await t.step("option's value is undefined", test({ value: undefined }));
  await t.step("option's value is empty spaces", test({ value: "  " }));
});

Deno.test("handleQnaCommand: questions not found - should return error message", async () => {
  const getOptionStub = stub(
    _internal,
    "getInteractionOptionString",
    returnsNext([{ value: "test-option" } as CommandStringOption]),
  );
  const searchQuestionsStub = stub(_internal, "searchQuestions", resolvesNext([[] as Question[]]));

  try {
    const res = await handleQnaCommand({} as GuildInteractionRequestData);

    assertEquals(res.data.content, 'No answers were found for question "test-option".');
    assertEquals(res.data.flags, InteractionResponseFlags.EPHEMERAL);
  } finally {
    getOptionStub.restore();
    searchQuestionsStub.restore();
  }
});

Deno.test("handleQnaCommand: questions found - should return first question's answer", async () => {
  const questions = [{
    question: "test-question-1",
    answer: "test-answer-1",
    guildId: "test-guildId-1",
  }, {
    question: "test-question-2",
    answer: "test-answer-2",
    guildId: "test-guildId-2",
  }] as Question[];

  const getOptionStub = stub(
    _internal,
    "getInteractionOptionString",
    returnsNext([{ value: "test-option" } as CommandStringOption]),
  );
  const searchQuestionsStub = stub(_internal, "searchQuestions", resolvesNext([questions]));

  try {
    const res = await handleQnaCommand({} as GuildInteractionRequestData);

    assertEquals(res.data.content, questions[0].answer);
    assertEquals(res.data.flags, undefined);
  } finally {
    getOptionStub.restore();
    searchQuestionsStub.restore();
  }
});
