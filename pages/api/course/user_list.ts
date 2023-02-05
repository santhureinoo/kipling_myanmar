// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withIronSessionApiRoute } from "iron-session/next";
import excuteQuery, { ironOptions } from '../../../utilities/db';

export default withIronSessionApiRoute(
    function userRoute(
    req: any,
    res: any
) {
    if (req.session.user) {
        //(optionally) set the SQL dialect
        // const sql = new Sql('mysql');


        console.log(req.session.user);
        const query = {
            text: `SELECT cs.* FROM courses cs INNER JOIN users_courses uc ON cs.id = uc.courses_id WHERE uc.users_id = ?`,
            values: [req.session.user.id]
        }

        try {
            excuteQuery({ query: query.text, values: query.values }).then((result: any) => {
                return res.status(200).json(result)
            })
        } catch (error: any) {
            return res.status(400).json(error)
        }

    } else {
        return res.status(400).json({
            'error' : 'Unauthorized'
        })
    }


}, ironOptions)
