// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Query, Sql } from 'sql-ts';
import excuteQuery from '../../../utilities/db';
import { users } from '../../../utilities/type';

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    //(optionally) set the SQL dialect
    const sql = new Sql('mysql');

    const user = sql.define<users>({
        name: 'users',
        columns: ['id', 'name', 'password', 'status', 'role', 'isNew']
    });


    let queryObj: Query<users>;

    if (req.query["name"]) {
        queryObj = user.select(user.star()).where(user.name.like(`%${req.query["name"]}%`)).where(user.role.equals(0));
    } else {
        queryObj = user.select(user.star()).where(user.role.equals(0));
    }

    if (req.query["pageIndex"]) {
        let pageIndex = parseInt(req.query["pageIndex"] as string || '1');
        queryObj.limit(10).offset((pageIndex - 1) * 10);
    }

    let query = queryObj.toQuery();

    try {
        const result: any = await excuteQuery({ query: query.text, values: query.values })
        return res.status(200).json(result);

    } catch (error: any) {
        return res.status(400).json(error)
    }
}
