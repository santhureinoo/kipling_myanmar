import { verify } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { ironOptions } from "../../../utilities/db";

export default function userRoute(req: NextApiRequest, res: NextApiResponse) {

    if (req.cookies['bearer token']) {
        res.send({
            isAuth: true,
            user: verify(req.cookies['bearer token'], process.env.JWT_RAND_STRING || 'jaPxKT9uxA')
        });
    } else {
        res.send({
            isAuth: false,
        });
    }

};