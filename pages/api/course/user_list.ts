
import { JwtPayload, verify } from 'jsonwebtoken';
import excuteQuery, { ironOptions } from '../../../utilities/db';
import { courses } from "../../../utilities/type";

export default async function userRoute(
    req: any,
    res: any
) {

    if (req.cookies['bearer token']) {

        const token : JwtPayload = verify(req.cookies['bearer token'], process.env.JWT_RAND_STRING || 'jaPxKT9uxA') as JwtPayload;
        //(optionally) set the SQL dialect
        // const sql = new Sql('mysql');
        const courses: courses[] = [];
        const userQuery = {
            text: `SELECT cs.* FROM courses cs INNER JOIN users_courses uc ON cs.id = uc.courses_id WHERE uc.users_id = ?`,
            values: [token.id]
        }

        const groupQuery = {
            text: `SELECT courses.*, gc.name as groupName FROM courses JOIN (SELECT gc.courseId as Id, g.name FROM groups g JOIN groups_users gu ON g.id = gu.groupId JOIN groups_courses gc ON gc.groupId = g.id  WHERE gu.userId =  ?) as gc ON courses.id = gc.Id`,
            values: [token.id]
        }

        try {
            const userResult: any = await excuteQuery({ query: userQuery.text, values: userQuery.values });
            userResult && userResult.forEach((res: any) => {
                courses.push(res);
            })

            const groupResult: any = await excuteQuery({ query: groupQuery.text, values: groupQuery.values });
            groupResult && groupResult.forEach((res: any) => {
                res.name = res.name + " (" + res.groupName + ")"
                courses.push(res);
            })

            return res.status(200).json(courses)
        } catch (error: any) {
            console.log(error);
            return res.status(400).json(error)
        }

    } else {
        return res.status(400).json({
            'error': 'Unauthorized'
        })
    }
};
