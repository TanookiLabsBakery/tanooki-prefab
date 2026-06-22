# frozen_string_literal: true

module Mutations
  module Organizations
    class OrganizationUpdate < BaseMutation
      description "Updates the current user's organization settings"

      field :organization, Types::Objects::OrganizationType, null: false

      argument :organization_input, Types::Inputs::OrganizationInputType, required: true

      def resolve(organization_input:)
        user = context[:current_user]
        raise GraphQL::ExecutionError, "You must be logged in" unless user

        organization = user.organization
        raise GraphQL::ExecutionError, "No organization found" unless organization

        unless organization.update(organization_input.to_h.compact)
          raise ValidationError.new "Error updating organization", record: organization
        end

        {organization: organization}
      end
    end
  end
end
