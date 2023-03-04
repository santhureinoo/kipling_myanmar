// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Sql } from 'sql-ts';
import excuteQuery from '../../../utilities/db';
import { files, users } from '../../../utilities/type';

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    //(optionally) set the SQL dialect
    const sql = new Sql('mysql');

    const file = sql.define<files>({
        name: 'files',
        columns: ['id', 'name', 'unique_name', 'status']
    });

    let queryObj = file.select(file.star());

    if (req.query["name"]) {
        queryObj = file.select(file.star()).where(file.name.like(`%${req.query["name"]}%`));
    } else if (req.query["trailer"]) {
        queryObj = file.select(file.star()).where(file.id.equals(req.query["trailer"]));
    }

    if (req.query["pageIndex"]) {
        let pageIndex = parseInt(req.query["pageIndex"] as string || '1');
        queryObj.limit(10).offset((pageIndex - 1) * 10);
    }

    console.log(queryObj.toQuery());

    const query = queryObj.toQuery();
    try {
        const result: any = await excuteQuery({ query: query.text, values: query.values });
        return res.status(200).json(result);

    } catch (error: any) {
        return res.status(400).json(error)
    }
}
