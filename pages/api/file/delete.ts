// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Sql } from 'sql-ts';
import excuteQuery from '../../../utilities/db';
import { files, users } from '../../../utilities/type';

type Data = {
    name: string
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    // Get data submitted in request's body.
    const body: users = JSON.parse(req.body);

    //(optionally) set the SQL dialect
    const sql = new Sql('mysql');

    const file = sql.define<files>({
        name: 'files',
        columns: ['id', 'name', 'unique_name', 'status']
    });

    // Guard clause checks for first and last name,
    // and returns early if they are not found
    // if (!body.name || !body.password) {
    //     // Sends a HTTP bad request error code
    //     return res.status(400);
    // }

    const query = file.delete().where(file.id.equals(body.id)).toQuery();
    try {
        excuteQuery({ query: query.text, values: query.values }).then((result: any) => {
            return res.status(200).json(result)
        })

    } catch (error: any) {
        return res.status(400).json(error)
    }
}
