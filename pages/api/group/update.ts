// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Sql } from 'sql-ts';
import excuteQuery from '../../../utilities/db';
import { groups, groups_courses, groups_users } from '../../../utilities/type';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    //  Guard clause checks for first and last name,
    // and returns early if they are not found
    // if (!body.name || !body.password) {
    //     // Sends a HTTP bad request error code
    //     return res.status(400);
    // }

    // Get data submitted in request's body.
    const body: groups = JSON.parse(req.body);

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


    const clearCourseJuntionQuery = gc.delete().where(gc.groupId.equals(body.id)).toQuery();
    const createCourseJuntionQuery = (data: any[]) => {
        return gc.insert(data).toQuery();
    }

    const clearUserJuntionQuery = gu.delete().where(gu.groupId.equals(body.id)).toQuery();
    const createUserJuntionQuery = (data: any[]) => {
        return gu.insert(data).toQuery();
    }

    const { course_ids, user_ids, ...editedBody } = body;

    const query = groups.update(
        editedBody
    ).where(groups.id.equals(body.id)).toQuery();

    try {
        const result: any = await excuteQuery({ query: query.text, values: query.values });
        if (body.course_ids) {
            await excuteQuery({ query: clearCourseJuntionQuery.text, values: clearCourseJuntionQuery.values });
            const data = body.course_ids.map(cou => {
                return {
                    groupId: body.id,
                    courseId: cou.value,
                    status: 0,
                }
            });
            const createJunctQuery = createCourseJuntionQuery(data);
            await excuteQuery({ query: createJunctQuery.text, values: createJunctQuery.values });
        }

        if (body.user_ids) {
            await excuteQuery({ query: clearUserJuntionQuery.text, values: clearUserJuntionQuery.values });
            const data = body.user_ids.map(sel => {
                return {
                    groupId: body.id,
                    userId: sel.value,
                    status: 0,
                }
            });
            await excuteQuery({ query: createUserJuntionQuery(data).text, values: createUserJuntionQuery(data).values });
        }
        return res.status(200).json(result);

    } catch (error: any) {
        console.log(error);
        return res.status(400).json(error);
    }
}
