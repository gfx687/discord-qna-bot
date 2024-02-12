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

    assertEquals(res.data.flags, InteractionResponseFlags.EPHEMERAL);
    assertEquals(res.data.content, `Validation error. Problems: Required; Question is required; Answer is required.`);
  });
});

Deno.test("handleQnaNewModalSubmit: new question invalid - should return problems", async () => {
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

  // createQuestion should throw
});

// TODO:
// handleQnaNewModalSubmit
// 1. new question is invalid
// 2. question already exists
// 3. success
