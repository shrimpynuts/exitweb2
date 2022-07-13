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
  hash: string
  description: string
  requirement: string

  merkle_tree?: string
  icon_image_url?: string
  banner_image_url?: string
}
