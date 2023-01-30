// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from "googleapis";

type DriveFile = {
    kind: string;
    id: string;
    name: string;
    mimeType: "image/jpeg";
};

type Data = {
    files: DriveFile[];
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    if (req.query["access_token"]) {
        const auth_res = await fetch('https://graphql.api.dailymotion.com/oauth/token', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors',
            headers: {
                //   'Content-Type': 'application/json'
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'client_id': `${process.env.REACT_APP_DAILYMOTION_KEY}`,
                'client_secret': `${process.env.REACT_APP_DAILYMOTION_SECRET}`,
                'username': 'thureinoosan@gmail.com',
                'password': 'S@nthureinoo-123',
                'grant_type': 'refresh_token',
                'version': '2',
            }) // body data type must match "Content-Type" header
        });

        const auth_res_json = await auth_res.json();

        return res.status(200).json(auth_res_json);
    } else {
        const auth_res = await fetch('https://graphql.api.dailymotion.com/oauth/token', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors',
            headers: {
                //   'Content-Type': 'application/json'
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'client_id': `${process.env.REACT_APP_DAILYMOTION_KEY}`,
                'client_secret': `${process.env.REACT_APP_DAILYMOTION_SECRET}`,
                'username': 'thureinoosan@gmail.com',
                'password': 'S@nthureinoo-123',
                'grant_type': 'password',
                'version': '2',
            }) // body data type must match "Content-Type" header
        });

        const auth_res_json = await auth_res.json();

        return res.status(200).json(auth_res_json);
    }


}
