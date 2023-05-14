// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Sql } from 'sql-ts';
import excuteQuery, { mysqlLastId } from '../../../utilities/db';
import { answers, exercises, exercises_files, questions, users } from '../../../utilities/type';
import rfdc from "rfdc";

const cloneDeep = rfdc();

interface ExerciseWithRemove {
    exercise: exercises,
    remQuest: string[],
    remAns: string[]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    //  Guard clause checks for first and last name,
    // and returns early if they are not found
    // if (!body.exercise.name || !body.exercise.password) {
    //     // Sends a HTTP bad request error code
    //     return res.status(400);
    // }

    // Get data submitted in request's body.exercise.
    const body: ExerciseWithRemove = JSON.parse(req.body);

    //(optionally) set the SQL dialect
    const sql = new Sql('mysql');

    const exercise = sql.define<exercises>({
        name: 'exercises',
        columns: ['id', 'name', 'courses_id', 'status']
    });

    const question = sql.define<questions>({
        name: 'questions',
        columns: ['id', 'question', 'type', 'exercise_id']
    });

    const answer = sql.define<answers>({
        name: 'answers',
        columns: ['id', 'question_id', 'answer', 'type', 'valid', 'explanation']
    });


    const exercises_file = sql.define<exercises_files>({
        name: 'exercises_files',
        columns: ['files_id', 'exercises_id']
    });

    const clearJuntionQuery = exercises_file.delete().where(exercises_file.exercises_id.equals(body.exercise.id)).toQuery();

    const removeQuestQuery = (id: any) => {
        console.log(question.delete().where(question.id.equals(id)).toQuery())
        return question.delete().where(question.id.equals(id)).toQuery();
    }

    const removeAnsQuery = (id: any, idType = 'answer') => {
        if (idType === 'answer') {
            return answer.delete().where(answer.id.equals(id)).toQuery();
        } else {
            return answer.delete().where(answer.question_id.equals(id)).toQuery();
        }

    }

    const query = exercise.update(
        {
            name: body.exercise.name,
            courses_id: body.exercise.courses_id,
            status: body.exercise.status
        }
    ).where(exercise.id.equals(body.exercise.id)).toQuery();

    const updateQuestionQuery = (quest: questions) => {
        const clonedQuest = cloneDeep(quest);

        delete clonedQuest.id;
        delete clonedQuest.answers;
        delete clonedQuest.created_at;
        delete clonedQuest.updated_at;
        return question.update(
            clonedQuest
        ).where(question.id.equals(quest.id)).toQuery();
    }

    const createQuestionQuery = (data: questions) => {
        const clonedQuestion = cloneDeep(data);

        delete clonedQuestion.id;
        delete clonedQuestion.answers;
        return question.insert(clonedQuestion).toQuery();
    }

    const createAnswerQuery = (data: answers) => {
        const clonedAnswer = cloneDeep(data);

        delete clonedAnswer.id;
        return answer.insert(clonedAnswer).toQuery();
    }

    const updateAnswerQuery = (ans: answers) => {
        const clonedAnswer = cloneDeep(ans);

        delete clonedAnswer.id;
        delete clonedAnswer.created_at;
        delete clonedAnswer.updated_at;

        return answer.update(
            clonedAnswer
        ).where(answer.id.equals(ans.id)).toQuery();
    }

    const fileQuery = (data: any[]) => {
        return exercises_file.insert(data).toQuery();
    };

    try {
        const result = await excuteQuery({ query: query.text, values: query.values });
        await excuteQuery({ query: clearJuntionQuery.text, values: clearJuntionQuery.values });

        if (body.exercise.files) {
            let fileData = [];
            for (let index = 0; index < body.exercise.files.length; index++) {
                const file = body.exercise.files[index];
                fileData.push({
                    exercises_id: body.exercise.id,
                    files_id: file.value,
                })
            }
            await excuteQuery({ query: fileQuery(fileData).text, values: fileQuery(fileData).values });
        }

        if (body.exercise.questions) {
            for (let index = 0; index < body.exercise.questions.length; index++) {
                const quest = body.exercise.questions[index];
                if (!quest.id?.toString().startsWith('Q-')) {
                    await excuteQuery({ query: updateQuestionQuery(quest).text, values: updateQuestionQuery(quest).values });
                    if (quest.answers && quest.answers.length) {
                        quest.answers.forEach(ans => {
                            if (!ans.id?.toString().startsWith('A-')) {
                                excuteQuery({ query: updateAnswerQuery(ans).text, values: updateAnswerQuery(ans).values });
                            } else {
                                ans.question_id = quest.id;
                                excuteQuery({ query: createAnswerQuery(ans).text, values: createAnswerQuery(ans).values });
                            }
                        })
                    }
                } else {
                    quest.exercise_id = body.exercise.id;
                    await excuteQuery({ query: createQuestionQuery(quest).text, values: createQuestionQuery(quest).values });
                    const question_id: any = await excuteQuery({ query: mysqlLastId });
                    if (quest.answers && quest.answers.length) {
                        quest.answers.forEach(ans => {
                            ans.question_id = question_id[0].ID;
                            excuteQuery({ query: createAnswerQuery(ans).text, values: createAnswerQuery(ans).values });
                        })
                    }
                }

            }
        }

        if (body.remQuest) {
            body.remQuest.forEach(async questId => {
                await excuteQuery({ query: removeAnsQuery(questId, 'question').text, values: removeAnsQuery(questId, 'question').values });
                await excuteQuery({ query: removeQuestQuery(questId).text, values: removeQuestQuery(questId).values });
            })
        }

        if (body.remAns) {
            body.remAns.forEach(async answerId => {
                await excuteQuery({ query: removeAnsQuery(answerId).text, values: removeAnsQuery(answerId).values });
            })
        }
        return res.status(200).json({ "id": body.exercise.id, 'result': result });
    } catch (error: any) {
        return res.status(400).end();
    }
}
