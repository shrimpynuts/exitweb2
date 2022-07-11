import { gql } from '@apollo/client'

export const INSERT_SUBMISSION_ONE = gql`
  mutation InsertSubmissionOne($submission: submissions_insert_input!) {
    insert_submissions_one(object: $submission) {
      id
      created_at
    }
  }
`

export const UPDATE_SUBMISSION_APPROVAL = gql`
  mutation UpdateSubmissionApproval($submissionIds: [Int!]!, $approved: Boolean!) {
    update_submissions(where: { id: { _in: $submissionIds } }, _set: { approved: $approved }) {
      affected_rows
    }
  }
`
