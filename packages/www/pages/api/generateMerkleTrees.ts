import type { NextApiRequest, NextApiResponse } from 'next'

import client from '../../lib/graphql-client'
import { GET_SUBMISSIONS } from '../../graphql/queries'
import { MerkleTree } from '../../lib/MerkleTree'
import { randomBigInt } from '../../lib/Library'
import { ISubmission } from '../../types'

const DEFAULT_HEIGHT = 5

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { communityId } = req.query
  if (!communityId) return res.status(400).json({ error: 'Missing communityId' })

  // Query the database for all submissions for the given community
  const { data } = await client.query({ query: GET_SUBMISSIONS, variables: { communityId: communityId } })
  const submissions: ISubmission[] = data.submissions
  const commitments: BigInt[] = submissions.filter((obj) => obj.approved).map((obj) => BigInt(obj.commitment))

  if (commitments.length > 2 ** DEFAULT_HEIGHT) return console.error('Too many commitments for tree height')

  // Pad on random commitments to the tree until it is full
  for (let i = commitments.length; i < 2 ** DEFAULT_HEIGHT; i++) commitments.push(randomBigInt(31))

  try {
    const merkleTree = MerkleTree.createFromLeaves(commitments)
    res.status(200).json({ merkleTree: merkleTree.getStorageString() })
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}
