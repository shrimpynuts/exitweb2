import { gql } from '@apollo/client'
import { CORE_SUBMISSION_FIELDS, CORE_COMMUNITY_FIELDS, CORE_MESSAGE_FIELDS } from './fragments'

export const GET_ALL_SUBMISSIONS = gql`
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
    submissions(where: { community_id: { _eq: $id } }, order_by: { created_at: asc }) {
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

export const GET_COMMUNITY_BY_SLUG = gql`
  ${CORE_COMMUNITY_FIELDS}
  query GetCommunityBySlug($slug: String!) {
    community(where: { slug: { _eq: $slug } }) {
      ...CoreCommunityFields
    }
  }
`

export const GET_MESSAGES_BY_COMMUNITY = gql`
  ${CORE_MESSAGE_FIELDS}
  query MessagesByCommunity($community_id: uuid!) {
    messages(where: { community_id: { _eq: $community_id } }, order_by: { created_at: asc }) {
      community_id
      created_at
      from
      id
      text
      updated_at
    }
  }
`
