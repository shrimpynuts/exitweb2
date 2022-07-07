import { buildPoseidon } from 'circomlibjs'

let poseidon: any
let F: any

// NOTE: picked this as the null field element arbitrarily
const NULL_NODE = '1'

// NOTE: default tree depth based on dao hack confessions
async function buildTreePoseidon(leaves: string[], depth = 15, proof_depth = 30, nullNode = NULL_NODE) {
  if (!poseidon) {
    poseidon = await buildPoseidon()
    F = poseidon.F
  }

  // pad with nullNode to guarantee a tree of the desired depth
  const requiredLeaves = 2 ** depth
  if (leaves.length < requiredLeaves) {
    leaves = leaves.concat(Array(requiredLeaves - leaves.length).fill(nullNode))
  }

  leaves = leaves.map((leaf) => `0x${leaf}`)
  leaves.sort()

  // the equivalent of pathElements and pathIndices in merkle.circom
  const outputLeaves = leaves.filter((w: string) => w !== nullNode)
  let leafToPathElements: { [leaf: string]: string[] } = Object.fromEntries(outputLeaves.map((w: string) => [w, []]))
  let leafToPathIndices: { [leaf: string]: string[] } = Object.fromEntries(outputLeaves.map((w: string) => [w, []]))

  let nodeToLeaves = Object.fromEntries(leaves.map((w: string) => [w, [w]]))
  let curLevel = leaves
  while (curLevel.length > 1) {
    let newLevel = []

    for (let i = 0; i < curLevel.length; i += 2) {
      let child1 = curLevel[i]
      let child2 = i == curLevel.length - 1 ? nullNode : curLevel[i + 1]

      let child1Leaves = nodeToLeaves[child1]
      let child2Leaves = child2 == nullNode ? [] : nodeToLeaves[child2]

      for (const leaf of child1Leaves) {
        if (leaf !== nullNode) {
          leafToPathElements[leaf].push(child2)
          leafToPathIndices[leaf].push('0')
        }
      }

      for (const leaf of child2Leaves) {
        if (leaf !== nullNode) {
          leafToPathElements[leaf].push(child1)
          leafToPathIndices[leaf].push('1')
        }
      }

      let poseidonRes = poseidon([child1, child2])
      let parent = F.toObject(poseidonRes)

      nodeToLeaves[parent] = child1Leaves.concat(child2Leaves)

      newLevel.push(parent)
    }

    curLevel = newLevel
  }

  for (const leaf in leafToPathElements) {
    while (leafToPathElements[leaf].length < proof_depth) {
      leafToPathElements[leaf].push(nullNode)
      leafToPathIndices[leaf].push('0')
    }
  }

  return {
    root: curLevel[0],
    leafToPathElements,
    leafToPathIndices,
  }
}

export { buildTreePoseidon }
