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

    //(optionally) set the SQL dialect
    const sql = new Sql('mysql');

    const file = sql.define<files>({
        name: 'files',
        columns: ['id', 'name', 'unique_name', 'status']
    });

    let query = file.select(file.star()).toQuery();

    if (req.query["name"]) {
        query = file.select(file.star()).where(file.name.like(`%${req.query["name"]}%`)).toQuery();
    } else if (req.query["trailer"]) {
        query = file.select(file.star()).where(file.id.equals(req.query["trailer"])).toQuery();
    }
    try {
        excuteQuery({ query: query.text, values: query.values }).then((result: any) => {
            return res.status(200).json(result)
        })

    } catch (error: any) {
        return res.status(400).json(error)
    }
}
