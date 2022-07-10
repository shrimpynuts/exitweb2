import type { NextApiRequest, NextApiResponse } from 'next'
import client from '../../lib/graphql-client'
import { GET_SUBMISSIONS } from '../../graphql/queries'
import { MerkleTree } from '../../lib/MerkleTree'
import { pedersenHashConcat, toHex, randomBigInt } from '../../lib/Library'

const TEST_USER = randomBigInt(31)
const TEST_COMMUNITY_HASH = randomBigInt(31)

const TEST_COMMITMENTS = [pedersenHashConcat(TEST_USER, TEST_COMMUNITY_HASH)]
const DEFAULT_HEIGHT = 5

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data } = await client.query({
    query: GET_SUBMISSIONS,
  })

  // const commitments = data['submissions'].map((obj) => {
  //   if (!obj.approved) {
  //     return BigInt(obj.commitment)
  //   }
  // })
  const commitments = TEST_COMMITMENTS
  console.log(toHex(TEST_USER), toHex(TEST_COMMUNITY_HASH), toHex(TEST_COMMITMENTS[0]))

  if (commitments.length > 2 ** DEFAULT_HEIGHT) {
    console.error('Too many commitments for tree height')
  }

  for (let i = commitments.length; i < 2 ** DEFAULT_HEIGHT; i++) {
    commitments.push(randomBigInt(31))
  }

  const merkleTree = MerkleTree.createFromLeaves(commitments)

  try {
    res.status(200).json({ merkleTree: merkleTree.getStorageString() })
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}
