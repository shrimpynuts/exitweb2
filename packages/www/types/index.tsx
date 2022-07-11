export interface ISubmission {
  created_at: string
  updated_at: string

  id: string
  commitment: string
  approved: boolean
  community_id: string
  proof_of_interaction: string
}

export interface ICommunity {
  created_at: string
  updated_at: string

  id: string
  name: string
  merkle_tree: string
  hash: string
}
