// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Sql } from 'sql-ts';
import excuteQuery from '../../../utilities/db';
import { courses } from '../../../utilities/type';

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    //(optionally) set the SQL dialect
    const sql = new Sql('mysql');

    const courses = sql.define<courses>({
        name: 'courses',
        columns: ['id', 'photo', 'name', 'description', 'trailer_id']
    });

    let query = courses.select(courses.star()).toQuery();

    if (req.query["name"]) {
        query = courses.select(courses.star()).where(courses.name.like(`%${req.query["name"]}%`)).toQuery();
    }

    try {
        const result: any = await excuteQuery({ query: query.text, values: query.values });
        return res.status(200).json(result)

    } catch (error: any) {
        return res.status(400).json(error)
    }
}
