// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Sql } from 'sql-ts';
import excuteQuery from '../../../utilities/db';
import { users, users_courses } from '../../../utilities/type';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    // Get data submitted in request's body.
    const body: users = JSON.parse(req.body);

    //(optionally) set the SQL dialect
    const sql = new Sql('mysql');

    const user = sql.define<users>({
        name: 'users',
        columns: ['id', 'name', 'password', 'status', 'phoneNumber']
    });


    const uc = sql.define<users_courses>({
        name: 'users_courses',
        columns: ['users_id', 'courses_id', 'status']
    });

    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!body.name || !body.password) {
        // Sends a HTTP bad request error code
        return res.status(400);
    }

    const totalQuery = {
        text: "SELECT CONCAT('KPU-', lpad(count(*)+1, 2, 0)) as newID FROM users;",
    }
    const query = (id: any) => {
        return user.insert(user.id.value(id), user.status.value(body.status), user.name.value(body.name), user.password.value(body.password), user.phoneNumber.value(body.phoneNumber)).toQuery();
    }

    const clearJuntionQuery = uc.delete().where(uc.users_id.equals(body.id)).toQuery();
    const createJuntionQuery = (data: any[]) => {
        return uc.insert(data).toQuery();
    }

    try {
        const totalResult: any = await excuteQuery({ query: totalQuery.text });
        const totalID = totalResult[0].newID;
        const result: any = await excuteQuery({ query: query(totalID).text, values: query(totalID).values });
        if (body.course_ids) {
            await excuteQuery({ query: clearJuntionQuery.text, values: clearJuntionQuery.values });
            const data = body.course_ids.split(',').map(id => {
                return {
                    users_id: body.id,
                    courses_id: id
                }
            });
            await excuteQuery({ query: createJuntionQuery(data).text, values: createJuntionQuery(data).values });
        }

        return res.status(200).json(result)

    } catch (error: any) {
        return res.status(400).json(error)
    }
}
