import { NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import excuteQuery from "../../../utilities/db";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { type } = req.query;

    if (!type) {
        return res.status(400);
    }

    let externalQuery = '';

    if (type === 'users') {
        externalQuery = ' WHERE role != 1'
    }

    if (req.query['name']) {
        externalQuery += ` AND name like '%${req.query["name"]}%'`
    }

    const totalQuery = {
        query: `SELECT COUNT(id) as total FROM ${type}` + externalQuery,
        values: []
    }

    const result: any = await excuteQuery({ query: totalQuery.query, values: totalQuery.values });
    return res.status(200).json(result);
}