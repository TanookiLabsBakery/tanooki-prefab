# frozen_string_literal: true

module Types
  class Objects::OrganizationType < Types::BaseObject
    implements GraphQL::Types::Relay::Node

    field :name, String, null: false
    field :brand_voice_guidelines, String, null: true
  end
end
