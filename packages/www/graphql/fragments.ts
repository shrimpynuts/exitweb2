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
    updated_at
    created_at
    id

    name
    slug
    description
    requirement
    key
    merkle_tree
    icon_image_url
    banner_image_url
    contract_id
  }
`

export const CORE_MESSAGE_FIELDS = gql`
  fragment CoreMessageFields on messages {
    updated_at
    created_at
    id

    text
    from
    community_id
  }
`
