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

export const UPDATE_COMMUNITY_MERKLE_TREE = gql`
  mutation UpdateCommunityMerkleTree($merkle_tree: String!, $id: uuid!) {
    update_community_by_pk(pk_columns: { id: $id }, _set: { merkle_tree: $merkle_tree }) {
      id
      merkle_tree
      updated_at
    }
  }
`
