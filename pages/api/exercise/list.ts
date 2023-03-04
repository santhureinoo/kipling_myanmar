// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Query, Sql } from 'sql-ts';
import excuteQuery from '../../../utilities/db';
import { exercises, users } from '../../../utilities/type';

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    //(optionally) set the SQL dialect
    const sql = new Sql('mysql');

    const exercise = sql.define<exercises>({
        name: 'exercises',
        columns: ['id', 'name', 'courses_id']
    });

    let queryObj: Query<exercises>;

    queryObj = exercise.select(exercise.star());

    if (req.query["name"]) {
        queryObj = exercise.select(exercise.star()).where(exercise.name.like(`%${req.query["name"]}%`));
    }

    if (req.query["pageIndex"]) {
        let pageIndex = parseInt(req.query["pageIndex"] as string || '1');
        queryObj.limit(10).offset((pageIndex - 1) * 10);
    }

    let query = queryObj.toQuery();


    try {
        const result: any = await excuteQuery({ query: query.text, values: query.values });
        return res.status(200).json(result);

    } catch (error: any) {
        return res.status(400).json(error)
    }
}
