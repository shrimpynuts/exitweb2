import { gql } from '@apollo/client'
import { CORE_SUBMISSION_FIELDS } from './fragments'

export const GET_SUBMISSIONS = gql`
  ${CORE_SUBMISSION_FIELDS}
  query GetSubmissions {
    submissions {
      ...CoreSubmissionFields
    }
  }
`

export const GET_SUBMISSIONS_FOR_COMMUNITY = gql`
  ${CORE_SUBMISSION_FIELDS}
  query GetSubmissionsByCommunityId($id: uuid!) {
    community_by_pk(id: $id) {
      ...CoreSubmissionFields
    }
  }
`
