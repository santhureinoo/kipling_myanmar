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

    // Get data submitted in request's body.
    const body: any = JSON.parse(req.body);

    //(optionally) set the SQL dialect
    const sql = new Sql('mysql');

    const files = sql.define<files>({
        name: 'files',
        columns: ['id', 'name', 'unique_name', 'status']
    });


    // // Guard clause checks for first and last name,
    // // and returns early if they are not found
    // if (!body.name || !body.password) {
    //     // Sends a HTTP bad request error code
    //     return res.status(400);
    // }

    // const query = user.insert(user.id.value(body.id), user.status.value(body.status), user.name.value(body.name), user.password.value(body.password)).toQuery();
    const filesQuery = files.insert(files.name.value(body.name), files.unique_name.value(body.unique_name), files.status.value(body.status)).toQuery();
    // const getOneQuery = files.select(files.id, files.name, files.unique_name, files.status).order(files.created_at).toQuery();

    try {
        const result: any = await excuteQuery({ query: filesQuery.text, values: filesQuery.values });
        return res.status(200).json(result);

    } catch (error: any) {
        return res.status(400).json(error)
    }
}
