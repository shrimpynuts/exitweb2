import { gql } from '@apollo/client'

export const CORE_SUBMISSION_FIELDS = gql`
  fragment CoreSubmissionFields on submissions {
    id
    approved
    commitment
    community_id
    created_at
    proof_of_interaction
    updated_at
  }
`

export const CORE_COMMUNITY_FIELDS = gql`
  fragment CoreCommunityFields on community {
    hash
    id
    merkle_tree
    name
    updated_at
    created_at
  }
`
