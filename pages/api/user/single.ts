// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Sql } from 'sql-ts';
import excuteQuery from '../../../utilities/db';
import { courses, users, users_courses } from '../../../utilities/type';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!req.query["id"] && !req.query["name"]) {
        // Sends a HTTP bad request error code
        return res.status(400);
    }

    let userQuery;
    if (req.query["id"]) {
        userQuery = {
            query: `SELECT GROUP_CONCAT(courses.id) course_ids, GROUP_CONCAT(courses.name) course_names, users.id, users.name, users.status, users.password, users.phoneNumber FROM users LEFT JOIN users_courses ON users.id = users_courses.users_id LEFT JOIN courses ON courses.id=users_courses.courses_id WHERE users.id = ? GROUP BY users.id`,
            values: [req.query["id"]]
        }

        // const userValue = [req.query["id"] as string];
        try {
            const result: any = await excuteQuery({ query: userQuery.query, values: userQuery.values });
            if (result.length > 0)
                return res.status(200).json(result[0]);
            else
                return res.status(200).json({
                    success: false,
                    name: 'User not found.'
                })
        } catch (error: any) {
            return res.status(400).json(error);
        }
    } else {
        userQuery = {
            query: `SELECT GROUP_CONCAT(courses.id) course_ids, GROUP_CONCAT(courses.name) course_names, users.id, users.name, users.status, users.password FROM users LEFT JOIN users_courses ON users.id = users_courses.users_id LEFT JOIN courses ON courses.id=users_courses.courses_id WHERE users.name = ? ${req.query["admin"] ? ` AND users.role=1` : ''} GROUP BY users.id`,
            values: [req.query["name"]]
        }

        // const userValue = [req.query["id"] as string];
        try {
            const result: any = await excuteQuery({ query: userQuery.query, values: userQuery.values });
            if (result.length > 0)
                if (result[0].password !== req.query["password"]) {
                    return res.status(200).json({
                        success: false,
                        password: 'Password is incorrect.'
                    })
                } else if (result[0].status != 1) {
                    return res.status(200).json({
                        success: false,
                        message: 'This user account is currently not usable.'
                    })
                } else {
                    return res.status(200).json(result[0]);
                }
            else
                return res.status(200).json({
                    success: false,
                    name: 'User not found.'
                })
        } catch (error: any) {
            return res.status(400).json(error);
        }
    }


}
