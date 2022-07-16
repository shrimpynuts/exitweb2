import { gql } from '@apollo/client'
import { CORE_SUBMISSION_FIELDS, CORE_COMMUNITY_FIELDS } from './fragments'

export const GET_SUBMISSIONS = gql`
  ${CORE_SUBMISSION_FIELDS}
  query GetSubmissions {
    submissions(order_by: { created_at: asc }) {
      ...CoreSubmissionFields
    }
  }
`

export const GET_SUBMISSIONS_FOR_COMMUNITY = gql`
  ${CORE_SUBMISSION_FIELDS}
  query GetSubmissionsByCommunityId($id: uuid!) {
    submissions(where: { community_id: { _eq: $id } }) {
      ...CoreSubmissionFields
    }
  }
`

export const GET_ALL_COMMUNITIES = gql`
  ${CORE_COMMUNITY_FIELDS}
  query GetAllCommunities {
    community(order_by: { created_at: asc }) {
      ...CoreCommunityFields
    }
  }
`

export const GET_COMMUNITY_BY_ID = gql`
  ${CORE_COMMUNITY_FIELDS}
  query GetCommunityById($communityId: uuid!) {
    community_by_pk(id: $communityId) {
      ...CoreCommunityFields
    }
  }
`
