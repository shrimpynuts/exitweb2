import { gql } from '@apollo/client'

export const INSERT_SUBMISSION_ONE = gql`
  mutation InsertSubmissionOne($submission: submissions_insert_input!) {
    insert_submissions_one(object: $submission) {
      id
      created_at
    }
  }
`
