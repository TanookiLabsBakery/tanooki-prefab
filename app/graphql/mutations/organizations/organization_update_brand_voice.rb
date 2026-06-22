# frozen_string_literal: true

module Mutations
  module Organizations
    class OrganizationUpdateBrandVoice < BaseMutation
      description "Updates the brand voice guidelines for the current user's organization"

      field :organization, Types::Objects::OrganizationType, null: false

      argument :brand_voice_input, Types::Inputs::BrandVoiceInputType, required: true

      def resolve(brand_voice_input:)
        user = context[:current_user]
        raise GraphQL::ExecutionError, "You must be logged in" unless user

        organization = user.organization
        raise GraphQL::ExecutionError, "No organization found" unless organization

        authorize! organization, to: :update_brand_voice?

        unless organization.update(brand_voice_guidelines: brand_voice_input.to_h.to_json)
          raise ValidationError.new "Error updating brand voice guidelines", record: organization
        end

        {organization: organization}
      end
    end
  end
end
