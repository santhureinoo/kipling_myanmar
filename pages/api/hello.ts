// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import excuteQuery from '../../utilities/db';

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    excuteQuery({
      query: 'SELECT * FROM user',
    }).then((result : any) => {
      res.status(200).json(result)
    })

  } catch (error: any) {
    res.status(400).json(error)
  }
}
