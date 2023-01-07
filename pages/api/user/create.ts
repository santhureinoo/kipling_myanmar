// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import excuteQuery from '../../../utilities/db';
import { users } from '../../../utilities/type';

type Data = {
    name: string
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    // Get data submitted in request's body.
    const body : users = req.body;

    // Guard clause checks for first and last name,
    // and returns early if they are not found
    // if (!body.name || !body.password) {
    //     // Sends a HTTP bad request error code
    //     return res.status(400).json({ data: 'First or last name not found' })
    // }
    
    try {
        excuteQuery({
            query: 'INSERT ',
            value: '',
        }).then((result: any) => {
            res.status(200).json(result)
        })

    } catch (error: any) {
        res.status(400).json(error)
    }
}
