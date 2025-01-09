# frozen_string_literal: true

module Types
  class Objects::OrganizationType < Types::BaseObject
    implements GraphQL::Types::Relay::Node

    field :organization_type, Enums::OrganizationTypeType, null: false
    field :name, String, null: false
    field :slug, String, null: false
    # field :time_zone, String, null: false # TODO tz type?

    field(
      :users,
      Objects::UserType.connection_type,
      null: false
    )
    def users
      object.memberships.includes(:user).order("user.name")
    end

    # TODO authenticate this
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    # TODO authenticate this
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
