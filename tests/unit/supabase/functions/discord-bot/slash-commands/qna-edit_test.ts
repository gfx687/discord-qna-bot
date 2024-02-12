import { assertEquals } from "https://deno.land/std@0.132.0/testing/asserts.ts";
import { assertSpyCall, resolvesNext, returnsNext, stub } from "https://deno.land/std@0.214.0/testing/mock.ts";
import {
  CommandStringOption,
  ComponentTextInput,
  ComponentType,
  GuildInteractionRequestData,
  GuildModalSubmitRequestData,
  InteractionResponseFlags,
  InteractionResponseType,
} from "npm:slash-create";
import {
  _internal,
  handleQnaEditCommand,
} from "../../../../../../supabase/functions/discord-bot/slash-commands/qna-edit.ts";
import { InteractionResponseReply } from "../../../../../../supabase/functions/discord-bot/data/discord-types.ts";
import { Question, QuestionEditProcess } from "../../../../../../supabase/functions/discord-bot/data/question-types.ts";
import { handleQnaEditModalSubmit } from "../../../../../../supabase/functions/discord-bot/slash-commands/qna-edit.ts";
import { EditModalAnswerInputCustomId } from "../../../../../../supabase/functions/discord-bot/slash-commands/qna-edit.ts";

Deno.test("handleQnaEditCommand: search term not valid - should return error message", async () => {
  const getOptionStub = stub(_internal, "getInteractionOptionString", returnsNext([undefined]));

  try {
    const res = await handleQnaEditCommand({} as GuildInteractionRequestData);

    assertEquals(res.type, InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE);
    const { data } = res as InteractionResponseReply;
    assertEquals(data.content, "Question cannot be empty when using edit command.");
    assertEquals(data.flags, InteractionResponseFlags.EPHEMERAL);
  } finally {
    getOptionStub.restore();
  }
});

Deno.test("handleQnaEditCommand: question not found - should return error message", async () => {
  const getOptionStub = stub(
    _internal,
    "getInteractionOptionString",
    returnsNext([{ value: "search-term" } as CommandStringOption]),
  );
  const getQuestionsStub = stub(_internal, "getQuestion", resolvesNext([undefined]));

  try {
    const res = await handleQnaEditCommand({} as GuildInteractionRequestData);

    assertEquals(res.type, InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE);
    const { data } = res as InteractionResponseReply;
    assertEquals(
      data.content,
      "No question found. Make sure to provide full name of the question, edit command does not allow for ambiguity in search term.",
    );
    assertEquals(data.flags, InteractionResponseFlags.EPHEMERAL);
  } finally {
    getOptionStub.restore();
    getQuestionsStub.restore();
  }
});

Deno.test("handleQnaEditCommand: question found - should create edit process and return expected modal", async () => {
  const question = {
    question: "test-question",
    answer: "test-answer",
    guildId: "test-guildId",
  } as Question;

  const getOptionStub = stub(
    _internal,
    "getInteractionOptionString",
    returnsNext([{ value: "search-term" } as CommandStringOption]),
  );
  const getQuestionsStub = stub(_internal, "getQuestion", resolvesNext([question]));
  const createEditProcessStub = stub(_internal, "createEditProcess", resolvesNext([undefined]));

  try {
    const res = await handleQnaEditCommand({} as GuildInteractionRequestData);

    // TODO: assert that process is created with expected data (guild and question)
    // I can hack around not having processId from returned value but not startedAt
    assertSpyCall(createEditProcessStub, 0);

    assertEquals(res.type, InteractionResponseType.MODAL);
  } finally {
    getOptionStub.restore();
    getQuestionsStub.restore();
    createEditProcessStub.restore();
  }
});

Deno.test("handleQnaEditModalSubmit: edit process not found - should return error", async () => {
  const getEditProcessStub = stub(_internal, "getEditProcess", resolvesNext([undefined]));

  try {
    const res = await handleQnaEditModalSubmit({ data: { custom_id: "customId" } } as GuildModalSubmitRequestData);

    assertEquals(
      res.data.content,
      "Question not found. Unless someone deleted it while you were editing something went wrong.",
    );
    assertEquals(res.data.flags, InteractionResponseFlags.EPHEMERAL);
  } finally {
    getEditProcessStub.restore();
  }
});

Deno.test("handleQnaEditModalSubmit: new answer is not valid - should return error", async (t) => {
  const test = (textInput: ComponentTextInput) => async () => {
    const editProcess = {
      processId: "test-processId",
      question: "test-question",
      guildId: "test-guildId",
      startedAt: new Date(),
    } as QuestionEditProcess;
    const interaction = {
      data: {
        custom_id: "customId",
        components: [{
          type: ComponentType.ACTION_ROW,
          components: [textInput],
        }],
      },
    } as GuildModalSubmitRequestData;

    const getEditProcessStub = stub(_internal, "getEditProcess", resolvesNext([editProcess]));

    try {
      const res = await handleQnaEditModalSubmit(interaction);

      assertEquals(res.data.content, "Invalid answer was provided.");
      assertEquals(res.data.flags, InteractionResponseFlags.EPHEMERAL);
    } finally {
      getEditProcessStub.restore();
    }
  };

  await t.step(
    "new answer is white spaces",
    test({
      type: ComponentType.TEXT_INPUT,
      custom_id: EditModalAnswerInputCustomId,
      value: "    ",
    } as ComponentTextInput),
  );
  await t.step(
    "new answer is empty",
    test({
      type: ComponentType.TEXT_INPUT,
      custom_id: EditModalAnswerInputCustomId,
    } as ComponentTextInput),
  );
});

Deno.test("handleQnaEditModalSubmit: new answer is valid - should update question", async () => {
  const editProcess = {
    processId: "test-processId",
    question: "test-question",
    guildId: "test-guildId",
    startedAt: new Date(),
  } as QuestionEditProcess;
  const newAnswer = "new-answer";
  const interaction = {
    data: {
      components: [{
        type: ComponentType.ACTION_ROW,
        components: [{
          type: ComponentType.TEXT_INPUT,
          custom_id: EditModalAnswerInputCustomId,
          value: newAnswer,
        }],
      }],
    },
  } as GuildModalSubmitRequestData;

  const getEditProcessStub = stub(_internal, "getEditProcess", resolvesNext([editProcess]));
  const updateQuestionAnswerStub = stub(_internal, "updateQuestionAnswer", resolvesNext([undefined]));

  try {
    const res = await handleQnaEditModalSubmit(interaction);

    assertSpyCall(updateQuestionAnswerStub, 0, {
      args: [editProcess.guildId, editProcess.question, newAnswer],
    });
    assertEquals(
      res.data.content,
      `Saved new answer to question "${editProcess.question}".\n\n${newAnswer}`,
    );
    assertEquals(res.data.flags, undefined);
  } finally {
    getEditProcessStub.restore();
    updateQuestionAnswerStub.restore();
  }
});
