# frozen_string_literal: true

module Types
  class Enums::OrganizationTypeType < Types::Enums::BaseEnum
    description "Organization type enum"

    rails_enum(Organization.organization_types)
  end
end
