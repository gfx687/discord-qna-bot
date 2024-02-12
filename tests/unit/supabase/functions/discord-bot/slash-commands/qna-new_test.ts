import { assertEquals } from "https://deno.land/std@0.132.0/testing/asserts.ts";
import {
  handleQnaNewCommand,
  handleQnaNewModalSubmit,
  NewQuestionModalAnswerCustomId,
  NewQuestionModalQuestionCustomId,
} from "../../../../../../supabase/functions/discord-bot/slash-commands/qna-new.ts";
import {
  ComponentActionRow,
  ComponentTextInput,
  ComponentType,
  GuildModalSubmitRequestData,
  InteractionResponseFlags,
  InteractionResponseType,
} from "npm:slash-create";
import { resolvesNext, stub } from "https://deno.land/std@0.214.0/testing/mock.ts";
import { _internal } from "../../../../../../supabase/functions/discord-bot/slash-commands/qna-new.ts";

Deno.test("handleQnaNewCommand: when called - should return modal", () => {
  const res = handleQnaNewCommand();

  assertEquals(res.type, InteractionResponseType.MODAL);
});

Deno.test("handleQnaNewModalSubmit: new question is invalid - should return problems", async (t) => {
  await t.step("question not provided - should return problems", async () => {
    const interaction = {
      data: {
        components: [
          {
            type: ComponentType.ACTION_ROW,
            components: [
              {
                type: ComponentType.TEXT_INPUT,
                custom_id: NewQuestionModalAnswerCustomId,
                value: "new-answer",
              } as ComponentTextInput,
            ],
          } as ComponentActionRow,
        ],
      },
    } as GuildModalSubmitRequestData;

    const res = await handleQnaNewModalSubmit(interaction);

    assertEquals(res.data.flags, InteractionResponseFlags.EPHEMERAL);
    assertEquals(res.data.content, `Validation error. Problems: Required; Question is required.`);
  });

  await t.step("answer not provided - should return problems", async () => {
    const interaction = {
      data: {
        components: [
          {
            type: ComponentType.ACTION_ROW,
            components: [
              {
                type: ComponentType.TEXT_INPUT,
                custom_id: NewQuestionModalQuestionCustomId,
                value: "new-question",
              } as ComponentTextInput,
            ],
          } as ComponentActionRow,
        ],
      },
    } as GuildModalSubmitRequestData;

    const res = await handleQnaNewModalSubmit(interaction);

    assertEquals(res.data.flags, InteractionResponseFlags.EPHEMERAL);
    assertEquals(res.data.content, `Validation error. Problems: Required; Answer is required.`);
  });

  await t.step("both not provided - should return problems", async () => {
    const interaction = {
      data: {
        components: [
          {
            type: ComponentType.ACTION_ROW,
            components: [],
          } as ComponentActionRow,
        ],
      },
    } as GuildModalSubmitRequestData;

    const res = await handleQnaNewModalSubmit(interaction);

    assertEquals(res.data.content, `Validation error. Problems: Required; Question is required; Answer is required.`);
    assertEquals(res.data.flags, InteractionResponseFlags.EPHEMERAL);
  });
});

// TODO: did not find how to make stub throw an error, skipping this test for now
// Deno.test("handleQnaNewModalSubmit: question already exists - should return error", async () => {});

Deno.test("handleQnaNewModalSubmit: question created - should return expected message", async () => {
  const interaction = {
    guild_id: "test-guildId",
    data: {
      components: [
        {
          type: ComponentType.ACTION_ROW,
          components: [
            {
              type: ComponentType.TEXT_INPUT,
              custom_id: NewQuestionModalQuestionCustomId,
              value: "new-question",
            } as ComponentTextInput,
          ],
        } as ComponentActionRow,
        {
          type: ComponentType.ACTION_ROW,
          components: [
            {
              type: ComponentType.TEXT_INPUT,
              custom_id: NewQuestionModalAnswerCustomId,
              value: "new-answer",
            } as ComponentTextInput,
          ],
        } as ComponentActionRow,
      ],
    },
  } as GuildModalSubmitRequestData;

  const createQuestionStub = stub(_internal, "createQuestion", resolvesNext([undefined]));

  try {
    const res = await handleQnaNewModalSubmit(interaction);

    assertEquals(
      res.data.content,
      `New question "new-question" has been added.\n\nnew-answer`,
    );
    assertEquals(res.data.flags, undefined);
  } finally {
    createQuestionStub.restore();
  }
});
