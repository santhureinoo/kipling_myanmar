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

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const CLIENT_ID =
        "232604679034-0q7mj4qa4cuidshfsmh93ashja2fqgmi.apps.googleusercontent.com";
    const CLIENT_SECRET = "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";
    const REDIRECT_URI = "https://developers.google.com/oauthplayground";
    const oauth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
    );
    oauth2Client.setCredentials({
        refresh_token:
            '1//04n9cejis2RR5CgYIARAAGAQSNwF-L9IrH5ESLfxTCaBl5S4y2ANIrEvjdLhUyqi_uyeE4S7cqUOue8xYUS2xg536c2IDEDvxezs',
    });
    const drive = google.drive({
        version: "v3",
        auth: oauth2Client,
        params: {
            q: `mimeType = 'image/jpeg'`,
        },
    });

    drive.files.list().then(response => {
        res.status(200).json({ files: response.data.files as DriveFile[] });
    })


}
