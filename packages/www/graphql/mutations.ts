import { gql } from '@apollo/client'

export const INSERT_SUBMISSIONS = gql`
  mutation InsertSubmissions($submissions: [submissions_insert_input!]!) {
    insert_submissions(objects: $submissions) {
      affected_rows
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

export const INSERT_COMMUNITY_ONE = gql`
  mutation InsertCommunityOne($newCommunity: community_insert_input!) {
    insert_community_one(object: $newCommunity) {
      created_at
      id
    }
  }
`

export const DELETE_COMMUNITY_BY_ID = gql`
  mutation DeleteCommunityById($id: uuid!) {
    delete_community(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`

export const INSERT_MESSAGE_ONE = gql`
  mutation InsertMessageOne($newMessage: messages_insert_input!) {
    insert_messages_one(object: $newMessage) {
      id
    }
  }
`

export const INSERT_COMMUNITY_MULTIPLE = gql`
  mutation InsertCommunityMultiple($communities: [community_insert_input!]!) {
    insert_community(objects: $communities) {
      affected_rows
    }
  }
`
