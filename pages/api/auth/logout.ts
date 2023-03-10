import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiResponse } from "next";
import { ironOptions } from "../../../utilities/db";

export type User = {
    isLoggedIn: boolean;
    login: string;
    avatarUrl: string;
};

export default withIronSessionApiRoute(
    async function logoutRoute(req: any, res: NextApiResponse) {
        // Guard clause checks for first and last name,
        // and returns early if they are not found
        req.session.destroy();
        res.send({ ok: true });


        // get user from database then:

    },
    ironOptions
);