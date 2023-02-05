// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Sql } from 'sql-ts';
import excuteQuery from '../../../utilities/db';
import { answers, exercises, exercises_files, files, questions, users } from '../../../utilities/type';

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!req.query["id"]) {
        // Sends a HTTP bad request error code
        return res.status(400);
    }

    //(optionally) set the SQL dialect
    const sql = new Sql('mysql');

    const exercise = sql.define<exercises>({
        name: 'exercises',
        columns: ['id', 'name', 'courses_id']
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

    const exerciseQuery = exercise.select(exercise.star()).where(exercise.id.equals(req.query["id"])).toQuery();

    const questionQuery = (exercise_id?: number) => {
        return question.select(question.star()).where(question.exercise_id.equals(exercise_id || 0)).toQuery();
    }

    const answerQuery = (question_ids: number[]) => {
        return answer.select(answer.star()).where(answer.question_id.in(question_ids)).toQuery();
    }

    const exerciseFileQuery = (exercise_id?: number) => {
        return {
            text: `SELECT f.* FROM exercises_files ef INNER JOIN files f ON ef.files_id= f.id WHERE exercises_id = ?`,
            values: [exercise_id]
        }
    }

    try {
        const exerciseResult: any = await excuteQuery({ query: exerciseQuery.text, values: exerciseQuery.values });
        if (exerciseResult && exerciseResult.length > 0) {
            const currentExercise: exercises = exerciseResult[0];
            const currentQuestionsRes: any = await excuteQuery({ query: questionQuery(currentExercise.id).text, values: questionQuery(currentExercise.id).values });
            const currentAnswersRes: any = await excuteQuery({ query: answerQuery(currentQuestionsRes.map((que: any) => que.id)).text, values: answerQuery(currentQuestionsRes.map((que: any) => que.id)).values });
            const currentFilesRes: any = await excuteQuery({ query: exerciseFileQuery(currentExercise.id).text, values: exerciseFileQuery(currentExercise.id).values });
            currentExercise.actualFiles = currentFilesRes;
            currentExercise.files = currentFilesRes.map((fileRes: files) => {
                return {
                    label: fileRes.name,
                    value: fileRes.id,
                }
            })
            currentExercise.questions = currentQuestionsRes.map((quest: questions) => {
                const currentAnsArr = currentAnswersRes.filter((ans: answers) => {
                    return ans.question_id === quest.id
                })
                quest.answers = currentAnsArr;
                return quest;
            })

            return res.status(200).json(currentExercise);

        } else {
            res.status(400);
        }
        // if (result && result.length > 0)
        //     return res.status(200).json(result[0]);
        // else
        //     return res.status(400);

    } catch (error: any) {
        return res.status(400).json(error);
    }
}
