import { deleteCookie, removeCookies } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { ironOptions } from "../../../utilities/db";

export type User = {
    isLoggedIn: boolean;
    login: string;
    avatarUrl: string;
};

export default async function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
    // Guard clause checks for first and last name,
    // and returns early if they are not found
    // req.session.destroy();
    res.setHeader(
        "Set-Cookie", [
        `bearer token=deleted; Max-Age=0; path=/`]
    );
    deleteCookie('bearer token', {
        sameSite: 'none',
        secure: true,
        req, res
    });
    return res.status(200).json({ ok: true })

};