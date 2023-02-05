import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import excuteQuery, { ironOptions } from "../../../utilities/db";
import { users } from "../../../utilities/type";

export type User = {
    isLoggedIn: boolean;
    login: string;
    avatarUrl: string;
};

export default withIronSessionApiRoute(
    async function loginRoute(req: any, res: NextApiResponse) {

        // Guard clause checks for first and last name,
        // and returns early if they are not found
        if (!req.query["password"] || !req.query["id"]) {
            // Sends a HTTP bad request error code
            return res.status(400);
        }

        const userQuery = {
            query: `SELECT GROUP_CONCAT(courses.id) course_ids, GROUP_CONCAT(courses.name) course_names, users.id, users.name, users.status, users.password, users.role FROM users LEFT JOIN users_courses ON users.id = users_courses.users_id LEFT JOIN courses ON courses.id=users_courses.courses_id WHERE users.id = ? AND users.password = ? ${req.query["admin"] ? ` AND users.role=1` : ' AND users.role=0'} GROUP BY users.id`,
            values: [req.query["id"], req.query["password"]]
        }

        // const userValue = [req.query["id"] as string];

        try {
            const result: any = await excuteQuery({ query: userQuery.query, values: userQuery.values });
            if (result.length > 0) {
                req.session.user = {
                    id: result[0].id,
                    admin: result[0].role === 1 ? true : false,
                };
                await req.session.save();
                res.send({ ok: true });
            }
            else {
                res.send({ ok: false });
            }
        } catch (error: any) {
            return res.status(400).json(error);
        }

        // get user from database then:

    },
    ironOptions
);