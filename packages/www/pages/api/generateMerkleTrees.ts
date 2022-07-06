import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.status(200).json({ hehe: 'haha' })
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}
