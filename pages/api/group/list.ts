// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Sql } from 'sql-ts';
import excuteQuery from '../../../utilities/db';
import { groups, groups_courses, groups_users, users } from '../../../utilities/type';

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    //(optionally) set the SQL dialect
    const sql = new Sql('mysql');

    let limitQuery = '';
    let searchByNameQuery = '';

    if (req.query["pageIndex"]) {
        let pageIndex = parseInt(req.query["pageIndex"] as string || '1');
        limitQuery = ` LIMIT 2 OFFSET ${(pageIndex - 1) * 2}`
    }

    if (req.query["name"]) {
        searchByNameQuery = ` WHERE name Like '%${req.query['name']}%'`;
    }


    const query = {
        text: `SELECT g.*, GROUP_CONCAT(gu.userId) as user_ids_string, GROUP_CONCAT(gc.courseId) as course_ids_string  FROM groups g LEFT JOIN groups_users gu ON g.id = gu.groupId LEFT JOIN groups_courses gc ON g.id = gc.groupId ${searchByNameQuery} GROUP BY g.id ${limitQuery}`,
        values: []
    }

    try {
        const result: any = await excuteQuery({ query: query.text, values: query.values });
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(400).json(error)
    }
}
