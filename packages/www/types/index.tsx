export interface ISubmission {
  created_at: string
  updated_at: string

  id: string
  commitment: string
  approved: boolean
  community_id: string
  proof_of_interaction: string
  proof_of_account_ownership: string
}

export interface ICommunity {
  created_at: string
  updated_at: string
  id: string

  name: string
  key: string
  description: string
  requirement: string
  contract_id?: number

  merkle_tree?: string
  icon_image_url?: string
  banner_image_url?: string
}
