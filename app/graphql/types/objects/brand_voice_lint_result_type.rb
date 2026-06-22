# frozen_string_literal: true

module Types
  class Objects::BrandVoiceLintResultType < Types::BaseObject
    field :compliant, Boolean, null: false
    field :issues, [String], null: false
    field :suggestions, [String], null: false
  end
end
