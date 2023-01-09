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

    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!req.query["id"]) {
        // Sends a HTTP bad request error code
        return res.status(400);
    }

    //(optionally) set the SQL dialect
    const sql = new Sql('mysql');

    const user = sql.define<users>({
        name: 'users',
        columns: ['id', 'name', 'password', 'status']
    });

    const query = user.select(user.star()).where(user.id.equals(req.query["id"])).toQuery();

    try {
        excuteQuery({ query: query.text, values: query.values }).then((result: any) => {
            if (result && result.length > 0)
                return res.status(200).json(result[0]);
            else
                return res.status(400);
        })

    } catch (error: any) {
        return res.status(400).json(error);
    }
}
