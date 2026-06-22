# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :internal_admin_user_update, mutation: Mutations::InternalAdmin::UserUpdate
    field :email_token_user_auth, mutation: Mutations::EmailTokenUserAuth
    field :credentials_user_auth, mutation: Mutations::CredentialsUserAuth
    field :email_user_auth_challenge, mutation: Mutations::EmailUserAuthChallenge
    field :logout, mutation: Mutations::Logout

    field :viewer_update, mutation: Mutations::ViewerUpdate
    field :complete_onboarding, mutation: Mutations::CompleteOnboarding

    field :post_create, mutation: Mutations::Posts::PostCreate
    field :post_generate_variants, mutation: Mutations::Posts::PostGenerateVariants
    field :post_request_approval, mutation: Mutations::Posts::PostRequestApproval
    field :post_approve, mutation: Mutations::Posts::PostApprove
    field :post_repurpose, mutation: Mutations::Posts::PostRepurpose
    field :post_repurpose_from_url, mutation: Mutations::Posts::PostRepurposeFromUrl
    field :post_reschedule, mutation: Mutations::Posts::PostReschedule
    field :channel_create, mutation: Mutations::Channels::ChannelCreate
    field :channel_delete, mutation: Mutations::Channels::ChannelDelete

    field :media_asset_create, mutation: Mutations::MediaAssets::MediaAssetCreate

    field :organization_update, mutation: Mutations::Organizations::OrganizationUpdate
    field :organization_update_brand_voice, mutation: Mutations::Organizations::OrganizationUpdateBrandVoice
  end
end
