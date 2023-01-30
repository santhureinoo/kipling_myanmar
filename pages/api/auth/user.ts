import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "../../../utilities/db";

export default withIronSessionApiRoute(
    function userRoute(req: any, res: any) {
        if (req.session.user) {
            res.send({
                isAuth: true,
                user: req.session.user
            });
        } else {
            res.send({
                isAuth: false,
            });
        }

    },
    ironOptions
);