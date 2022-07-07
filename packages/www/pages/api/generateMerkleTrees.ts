import type { NextApiRequest, NextApiResponse } from 'next'
import client from '../../backend/graphql-client'
import { GET_SUBMISSIONS } from '../../graphql/queries'
import { buildTreePoseidon } from '../../lib/merkleTrees'
import { ISubmission } from '../../types'

const SHA256 = require('crypto-js/sha256')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data } = await client.query({
    query: GET_SUBMISSIONS,
  })
  const commitments = data.submissions.map((submission: ISubmission) => submission.commitment)
  const hashedCommitments = commitments.map((commitment: string) => SHA256(commitment).toString())
  const tree = await buildTreePoseidon(hashedCommitments, 7, 30)
  console.log({ tree })
  console.log({ leaves: tree.leafToPathElements })
  console.log({ leaves: tree.leafToPathIndices })
  const treeResp = { root: 0 }
  try {
    res.status(200).json({ commitments, hashedCommitments, treeResp })
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}
