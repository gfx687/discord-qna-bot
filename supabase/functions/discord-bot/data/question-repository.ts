import { Question, QuestionEditProcess, questionEditProcessZod, questionZod } from "./question-types.ts";
import sql from "./db.ts";

export async function searchQuestions(guildId: string, term: string): Promise<Question[]> {
  const results = await sql<Question[]>`
        select
            guild_id as "guildId",
            question,
            answer
        from search_questions(${guildId}, ${term})`;

  return questionZod.array().parse(results);
}

export async function getQuestion(guildId: string, question: string): Promise<Question | undefined> {
  const results = await sql<Question>`
        select
            guild_id as "guildId",
            question,
            answer
        from qna
        where guild_id = ${guildId} and question = ${question}`;

  return results.count == 0 ? undefined : questionZod.parse(results[0]);
}

export function deleteQuestion(guildId: string, question: string): Promise<void> {
  return sql`
        delete from qna
        where guild_id = ${guildId} and question = ${question}`;
}

export function updateQuestionAnswer(guildId: string, question: string, newAnswer: string): Promise<void> {
  return sql`
        update qna
        set answer = ${newAnswer}
        where guild_id = ${guildId} and question = ${question}`;
}

export function createQuestion(question: Question) {
  return sql`
        insert into qna (guild_id, question, answer)
        values (${question.guildId}, ${question.question}, ${question.answer})`;
}

export async function getEditProcess(processId: string): Promise<QuestionEditProcess | undefined> {
  const results = await sql<QuestionEditProcess>`
        select
            process_id as "processId",
            guild_id as "guildId",
            question,
            started_at at time zone 'UTC' as "startedAt"
        from qna_edit_processes
        where process_id = ${processId}`;

  return results.count == 0 ? undefined : questionEditProcessZod.parse(results[0]);
}

export function createEditProcess(process: QuestionEditProcess): Promise<void> {
  return sql`
        insert into qna_edit_processes (process_id, guild_id, question, started_at)
        values (${process.processId}, ${process.guildId}, ${process.question}, ${process.startedAt})`;
}
