module Types
  module Enums
    class OrganizationTypeEnum < BaseEnum
      description "Organization Type enum"

      rails_enum(Organization.organization_types)
    end
  end
end
