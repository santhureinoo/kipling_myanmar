// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Sql } from 'sql-ts';
import excuteQuery from '../../../utilities/db';
import { exercises, exercises_files, users } from '../../../utilities/type';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    //  Guard clause checks for first and last name,
    // and returns early if they are not found
    // if (!body.name || !body.password) {
    //     // Sends a HTTP bad request error code
    //     return res.status(400);
    // }

    // Get data submitted in request's body.
    const body: exercises = JSON.parse(req.body);

    //(optionally) set the SQL dialect
    const sql = new Sql('mysql');

    const exercise = sql.define<exercises>({
        name: 'exercises',
        columns: ['id', 'name', 'courses_id', 'status']
    });

    const exercises_file = sql.define<exercises_files>({
        name: 'exercises_files',
        columns: ['files_id', 'exercises_id']
    });

    const clearJuntionQuery = exercises_file.delete().where(exercises_file.exercises_id.equals(body.id)).toQuery();

    const query = exercise.update(
        {
            name: body.name,
            courses_id: body.courses_id,
            status: body.status
        }
    ).where(exercise.id.equals(body.id)).toQuery();

    const fileQuery = (data: any[]) => {
        return exercises_file.insert(data).toQuery();
    };

    try {
        const result = await excuteQuery({ query: query.text, values: query.values });
        await excuteQuery({ query: clearJuntionQuery.text, values: clearJuntionQuery.values });

        if (body.files) {
            let fileData = [];
            for (let index = 0; index < body.files.length; index++) {
                const file = body.files[index];
                fileData.push({
                    exercises_id: body.id,
                    files_id: file.value,
                })
            }
            await excuteQuery({ query: fileQuery(fileData).text, values: fileQuery(fileData).values });
        }

        return res.status(200).json({ "id": body.id, 'result': result });

    } catch (error: any) {
        return res.status(400).end();
    }
}
