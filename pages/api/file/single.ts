// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Sql } from 'sql-ts';
import excuteQuery from '../../../utilities/db';
import { files } from '../../../utilities/type';

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    // Guard clause checks for first and last name,
    // and returns early if they are not found
    // if (!req.query["id"] || !req.query["name"]) {
    //     // Sends a HTTP bad request error code
    //     return res.status(400);
    // }

    //(optionally) set the SQL dialect
    const sql = new Sql('mysql');

    const file = sql.define<files>({
        name: 'files',
        columns: ['id', 'name', 'unique_name', 'status']
    });

    let query;

    if (req.query["id"]) {
        query = file.select(file.star()).where(file.id.equals(req.query["id"])).toQuery();
    } else {
        query = file.select(file.star()).where(file.name.contains(req.query["name"])).toQuery();
    }

    try {
        const result: any = await excuteQuery({ query: query.text, values: query.values });
        return res.status(200).json(result[0]);

    } catch (error: any) {
        return res.status(400).json(error);
    }
}
