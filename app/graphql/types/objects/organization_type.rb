# frozen_string_literal: true

module Types
  class Objects::OrganizationType < Types::BaseObject
    implements GraphQL::Types::Relay::Node

    field :organization_type, Types::Enums::OrganizationTypeEnum, null: false
    field :name, String, null: false
    field :slug, String, null: false
    # field :time_zone, String, null: false # TODO tz type?

    field(
      :users,
      Objects::UserType.connection_type,
      null: false,
      description: "Users who are connected to a campaign in this company by teh account_manager or sales_rep fields"
    )
    def users
      object.memberships.includes(:user).order("user.name")
    end

    field :created_at, GraphQL::Types::ISO8601DateTime, null: false # TODO authenticate this
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false # TODO authenticate this
  end
end
