// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Sql } from 'sql-ts';
import excuteQuery from '../../../utilities/db';
import * as short from 'short-uuid';
import { bulkUsers, groups, groups_users, users, users_courses } from '../../../utilities/type';
import { groupsmigration } from 'googleapis/build/src/apis/groupsmigration';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    // Get data submitted in request's body.
    const body: bulkUsers = JSON.parse(req.body);

    //(optionally) set the SQL dialect
    const sql = new Sql('mysql');

    const user = sql.define<users>({
        name: 'users',
        columns: ['id', 'name', 'password', 'status', 'phoneNumber', 'isNew', 'role']
    });

    const gu = sql.define<groups_users>({
        name: 'groups_users',
        columns: ['groupId', 'userId', 'status']
    });

    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!body.usernames || !body.groupIds) {
        // Sends a HTTP bad request error code
        return res.status(400);
    }

    const query = (userList: users[]) => {
        return user.insert(userList).toQuery();
    }

    const guQuery = (groupuserList: groups_users[]) => {
        return gu.insert(groupuserList).toQuery();
    }

    try {
        const userList: users[] = body.usernames.split(',').map(usr => {
            const generatedID = short.generate();
            const generatedPwd = short.generate();
            return {
                id: generatedID,
                password: generatedPwd,
                name: usr,
                role: 0,
                isNew: 1,
                status: 1,
            }
        });

        await excuteQuery({ query: query(userList).text, values: query(userList).values });

        if (body.groupIds.length > 0) {
            for (const us of userList) {
                const groups: groups_users[] = body.groupIds.map(id => {
                    return {
                        userId: us.id,
                        groupId: parseInt(id.value),
                        status: 1,
                    } as groups_users
                });
                await excuteQuery({ query: guQuery(groups).text, values: guQuery(groups).values });
            }
        }

        return res.status(200).json(userList);

    } catch (error: any) {
        console.log(error);
        return res.status(400).json(error)
    }
}
