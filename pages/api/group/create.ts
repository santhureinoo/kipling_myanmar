// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Sql } from 'sql-ts';
import excuteQuery, { mysqlLastId } from '../../../utilities/db';
import { groups, groups_courses, groups_users } from '../../../utilities/type';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

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

    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!body.name) {
        // Sends a HTTP bad request error code
        return res.status(400);
    }

    // const totalQuery = {
    //     text: "SELECT CONCAT('KPU-', lpad(count(*)+1, 2, 0)) as newID FROM users;",
    // }
    const query = () => {
        return groups.insert(groups.status.value(body.status), groups.name.value(body.name)).toQuery();
    }

    const clearJuntionQuery = gc.delete().where(gc.groupId.equals(body.id)).toQuery();
    const createJuntionQuery = (data: any[]) => {
        return gc.insert(data).toQuery();
    }

    const clearGuJuntionQuery = gu.delete().where(gu.groupId.equals(body.id)).toQuery();
    const createGuJuntionQuery = (data: any[]) => {
        return gu.insert(data).toQuery();
    }

    try {
        const result: any = await excuteQuery({ query: query().text, values: query().values });
        const groupId: any = await excuteQuery({ query: mysqlLastId });
        if (body.course_ids) {
            await excuteQuery({ query: clearJuntionQuery.text, values: clearJuntionQuery.values });
            const data = body.course_ids.map(sel => {
                return {
                    groupId: groupId[0].ID,
                    courseId: sel.value,
                    status: 1,
                }
            });
            await excuteQuery({ query: createJuntionQuery(data).text, values: createJuntionQuery(data).values });
        }
        if (body.user_ids) {
            await excuteQuery({ query: clearGuJuntionQuery.text, values: clearGuJuntionQuery.values });
            const data = body.user_ids.map(sel => {
                return {
                    groupId: groupId[0].ID,
                    userId: sel.value,
                    status: 1,
                }
            });
            await excuteQuery({ query: createGuJuntionQuery(data).text, values: createGuJuntionQuery(data).values });
        }

        return res.status(200).json(result)

    } catch (error: any) {
        return res.status(400).json(error)
    }
}
