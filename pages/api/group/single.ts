// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Sql } from 'sql-ts';
import excuteQuery from '../../../utilities/db';
import { courses, groups, groups_courses, groups_users, users } from '../../../utilities/type';

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

    //(optionally) set the SQL dialect
    const sql = new Sql('mysql');

    const groups = sql.define<groups>({
        name: 'groups',
        columns: ['id', 'name', 'status']
    });


    const gc = sql.define<groups_courses>({
        name: 'groups_courses',
        columns: ['groupId', 'courseId', 'status']
    });

    const gu = sql.define<groups_users>({
        name: 'groups_users',
        columns: ['groupId', 'userId', 'status']
    });


    let userQuery;
    if (req.query["id"]) {

        const groupQuery = groups.select(groups.star()).where(groups.id.equals(req.query["id"])).toQuery();
        const gcQuery = {
            text: `SELECT c.* FROM courses c INNER JOIN groups_courses gc ON c.id = gc.courseId WHERE gc.groupId=?`,
            values: [req.query["id"]]
        }
        const guQuery = {
            text: `SELECT u.* FROM users u INNER JOIN groups_users gu ON u.id = gu.userId WHERE gu.groupId=?`,
            values: [req.query["id"]]
        }
        // const gcQuery = gc.select(gc.star()).where(groups.groupId.equals(req.query["id"])).toQuery();
        // const groupGroup = groups.select(groups.star()).where(groups.groupId.equals(req.query["id"])).toQuery();

        try {
            const groupResult: any = await excuteQuery({ query: groupQuery.text, values: groupQuery.values });
            if (groupResult.length > 0) {
                const resultGroup: groups = groupResult[0];
                const gcResult: any = await excuteQuery({ query: gcQuery.text, values: gcQuery.values });
                const guResult: any = await excuteQuery({ query: guQuery.text, values: guQuery.values });
                resultGroup.course_ids = gcResult.map((c: courses) => {
                    return {
                        value: c.id,
                        label: c.name
                    }
                })
                resultGroup.user_ids = guResult.map((u: users) => {
                    return {
                        value: u.id,
                        label: u.name
                    }
                })
                return res.status(200).json(resultGroup);
            }
            else
                return res.status(200).json({
                    success: false,
                    name: 'Group not found.'
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
