import type { NextApiRequest, NextApiResponse } from 'next'
import client from '../../lib/graphql-client'
import { GET_SUBMISSIONS } from '../../graphql/queries'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data } = await client.query({
    query: GET_SUBMISSIONS,
  })

  try {
    res.status(200).json({ data })
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}
