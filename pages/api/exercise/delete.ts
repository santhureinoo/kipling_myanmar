// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Sql } from 'sql-ts';
import excuteQuery from '../../../utilities/db';
import { exercises, users } from '../../../utilities/type';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    // Get data submitted in request's body.
    const body: users = JSON.parse(req.body);

    //(optionally) set the SQL dialect
    const sql = new Sql('mysql');

    const exercise = sql.define<exercises>({
        name: 'exercises',
        columns: ['id', 'name', 'courses_id']
    });


    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!body.name || !body.password) {
        // Sends a HTTP bad request error code
        return res.status(400);
    }

    const query = exercise.delete().where(exercise.id.equals(body.id)).toQuery();
    try {
        const result = await excuteQuery({ query: query.text, values: query.values })
        console.log(result);
        return res.status(200).json(result)

    } catch (error: any) {
        return res.status(400).json(error)
    }
}
