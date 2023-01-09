// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Sql } from 'sql-ts';
import excuteQuery from '../../../utilities/db';
import { users } from '../../../utilities/type';

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

    const user = sql.define<users>({
        name: 'users',
        columns: ['id', 'name', 'password', 'status']
    });

    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!body.name || !body.password) {
        // Sends a HTTP bad request error code
        return res.status(400);
    }

    const query = user.insert(user.id.value(body.id), user.status.value(body.status), user.name.value(body.name), user.password.value(body.password)).toQuery();
    try {
        excuteQuery({ query: query.text, values: query.values }).then((result: any) => {
            return res.status(200).json(result)
        })

    } catch (error: any) {
        return res.status(400).json(error)
    }
}
