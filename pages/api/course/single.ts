// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import { request } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Sql } from 'sql-ts';
import excuteQuery from '../../../utilities/db';
import { courses, users } from '../../../utilities/type';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!req.query["id"]) {
        // Sends a HTTP bad request error code
        return res.status(400);
    }

    //(optionally) set the SQL dialect
    const sql = new Sql('mysql');

    const course = sql.define<courses>({
        name: 'courses',
        columns: ['id', 'photo', 'name', 'description', 'trailer_id']
    });
    // let query = course.select(course.star()).where(course.id.equals(req.query["id"])).toQuery();

    const query = {
        text: `SELECT c.*, count(e.id) as exercise_counts,  GROUP_CONCAT(e.name) as exercise_names, GROUP_CONCAT(e.id) as exercise_ids FROM courses as c LEFT JOIN exercises as e ON c.id = e.courses_id WHERE c.id = ? GROUP BY c.id`,
        values: [req.query["id"] as string]
    }
    try {
        const result: any = await excuteQuery({ query: query.text, values: query.values })
        return res.status(200).json(result[0]);

    } catch (error: any) {
        return res.status(400).json(error);
    }
}
