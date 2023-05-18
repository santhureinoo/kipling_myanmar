// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Sql } from 'sql-ts';
import excuteQuery, { mysqlLastId } from '../../../utilities/db';
import { answers, exercises, exercises_files, questions, users } from '../../../utilities/type';

interface ExerciseWithRemove {
    exercise: exercises,
    remQuest: string[],
    remAns: string[]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    // Get data submitted in request's body.
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


    // // Guard clause checks for first and last name,
    // // and returns early if they are not found
    // if (!body.name || !body.password) {
    //     // Sends a HTTP bad request error code
    //     return res.status(400);
    // }

    // const query = user.insert(user.id.value(body.id), user.status.value(body.status), user.name.value(body.name), user.password.value(body.password)).toQuery();

    const exerciseQuery = exercise.insert(exercise.name.value(body.exercise.name), exercise.courses_id.value(body.exercise.courses_id), exercise.status.value(1)).toQuery();

    const questionQuery = (data: any[]) => {
        return question.insert(data).toQuery();
    }

    const answerQuery = (data: any[]) => {
        return answer.insert(data).toQuery();
    }

    const fileQuery = (data: any[]) => {
        return exercises_file.insert(data).toQuery();
    }

    try {
        const result: any = await excuteQuery({ query: exerciseQuery.text, values: exerciseQuery.values });
        const exercise_id: any = await excuteQuery({ query: mysqlLastId });

        if (body.exercise.files) {
            let fileData = [];
            for (let index = 0; index < body.exercise.files.length; index++) {
                const file = body.exercise.files[index];
                fileData.push({
                    exercises_id: exercise_id[0].ID,
                    files_id: file.value,
                })
            }
            const res = await excuteQuery({ query: fileQuery(fileData).text, values: fileQuery(fileData).values });
        }

        let questRes = [];
        if (body.exercise.questions) {
            for (let index = 0; index < body.exercise.questions.length; index++) {

                const quest = body.exercise.questions[index];
                let questionData: any[] = [];
                questionData.push({
                    question: quest.question,
                    type: quest.type,
                    exercise_id: exercise_id[0].ID,
                    status: 1,
                })
                questRes.push(await excuteQuery({ query: questionQuery(questionData).text, values: questionQuery(questionData).values }));
                const question_id: any = await excuteQuery({ query: mysqlLastId });
                if (quest.answers) {
                    let answerData: any[] = [];
                    quest.answers.forEach(ans => {
                        answerData.push(
                            {
                                question_id: question_id[0].ID,
                                answer: ans.answer,
                                type: ans.type,
                                valid: ans.valid,
                                explanation: ans.explanation
                            }
                        )
                    })

                    const errRes = await excuteQuery({ query: answerQuery(answerData).text, values: answerQuery(answerData).values });
                     console.log(errRes);
                }
            }
        }
        return res.status(200).json({ "id": exercise_id, 'result': questRes });

    } catch (error: any) {
        console.log(error);
        return res.status(400).json(error)
    }
}
