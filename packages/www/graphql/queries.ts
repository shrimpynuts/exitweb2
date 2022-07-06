import { gql } from '@apollo/client'
import { CORE_SUBMISSION_FIELDS } from './fragments'

export const GET_SUBMISSIONS = gql`
  ${CORE_SUBMISSION_FIELDS}
  query MyQuery {
    submissions {
      ...CoreSubmissionFields
    }
  }
`
