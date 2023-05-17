import { setCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import excuteQuery from "../../../utilities/db";
import { JsonWebTokenError, sign } from "jsonwebtoken";

export type User = {
    isLoggedIn: boolean;
    login: string;
    avatarUrl: string;
};

export default async function loginRoute(req: NextApiRequest, res: NextApiResponse) {

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

            // setCookie('login', 'test', { req, res, maxAge: 60 * 60 * 24 });
            // req.session.user = {
            //     id: result[0].id,
            //     admin: result[0].role === 1 ? true : false,
            // };

            // await req.session.save();

            setCookie('bearer token',
                sign({
                    id: result[0].id,
                    admin: result[0].role === 1 ? true : false,
                }, process.env.JWT_RAND_STRING || 'jaPxKT9uxA'), { 
                    sameSite:'lax',
                    req, res, maxAge: 60 * 60 * 24 });
            res.send({ ok: true });
        }
        else {
            res.send({ ok: false });
        }
    } catch (error: any) {
        return res.status(400).json(error);
    }

    // get user from database then:

};