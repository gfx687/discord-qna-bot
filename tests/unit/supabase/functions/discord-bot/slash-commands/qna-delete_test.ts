import { assertSpyCall, resolvesNext, returnsNext, stub } from "https://deno.land/std@0.214.0/testing/mock.ts";
import {
  _internal,
  handleQnaDeleteCommand,
} from "../../../../../../supabase/functions/discord-bot/slash-commands/qna-delete.ts";
import { CommandStringOption, GuildInteractionRequestData, InteractionResponseFlags } from "npm:slash-create";
import { assertEquals } from "https://deno.land/std@0.132.0/testing/asserts.ts";
import { Question } from "../../../../../../supabase/functions/discord-bot/data/question-types.ts";

Deno.test("handleQnaDeleteCommand: search term not valid - should return error message", async () => {
  const getOptionStub = stub(_internal, "getInteractionOptionString", returnsNext([undefined]));

  try {
    const res = await handleQnaDeleteCommand({} as GuildInteractionRequestData);

    assertEquals(res.data.content, "Question cannot be empty when using delete command.");
    assertEquals(res.data.flags, InteractionResponseFlags.EPHEMERAL);
  } finally {
    getOptionStub.restore();
  }
});

Deno.test("handleQnaDeleteCommand: question not found - should return error message", async () => {
  const getOptionStub = stub(
    _internal,
    "getInteractionOptionString",
    returnsNext([{ value: "search-term" } as CommandStringOption]),
  );
  const getQuestionsStub = stub(_internal, "getQuestion", resolvesNext([undefined]));

  try {
    const res = await handleQnaDeleteCommand({} as GuildInteractionRequestData);

    assertEquals(
      res.data.content,
      "No question found. Make sure to provide full name of the question, delete command does not allow for ambiguity in search term.",
    );
    assertEquals(res.data.flags, InteractionResponseFlags.EPHEMERAL);
  } finally {
    getOptionStub.restore();
    getQuestionsStub.restore();
  }
});

Deno.test("handleQnaDeleteCommand: question found - should call delete", async () => {
  const question = {
    question: "some-question",
    guildId: "guild-id",
  } as Question;

  const getOptionStub = stub(
    _internal,
    "getInteractionOptionString",
    returnsNext([{ value: "search-term" } as CommandStringOption]),
  );
  const getQuestionsStub = stub(_internal, "getQuestion", resolvesNext([question]));
  const deleteQuestionStub = stub(_internal, "deleteQuestion", resolvesNext([undefined]));

  try {
    const res = await handleQnaDeleteCommand({ guild_id: question.guildId } as GuildInteractionRequestData);

    assertSpyCall(deleteQuestionStub, 0, {
      args: [question.guildId, question.question],
    });
    assertEquals(res.data.content, `Done. Question "${question.question}" has been deleted.`);
    assertEquals(res.data.flags, undefined);
  } finally {
    getOptionStub.restore();
    getQuestionsStub.restore();
    deleteQuestionStub.restore();
  }
});
