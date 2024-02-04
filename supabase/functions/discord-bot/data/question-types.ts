import { z } from "https://deno.land/x/zod@v3.22.4/index.ts";

export const questionZod = z.object({
  guildId: z.string(),
  question: z
    .string({
      required_error: "Question is required",
      invalid_type_error: "Question is invalid",
    })
    .min(1, { message: "Question must not be empty" }),
  answer: z
    .string({
      required_error: "Answer is required",
      invalid_type_error: "Answer is invalid",
    })
    .min(1, { message: "Answer must not be empty" }),
});

export type Question = z.infer<typeof questionZod>;

export const questionEditProcessZod = z.object({
  processId: z.string(),
  guildId: z.string(),
  question: z.string(),
  startedAt: z.date(),
});

export type QuestionEditProcess = z.infer<typeof questionEditProcessZod>;
