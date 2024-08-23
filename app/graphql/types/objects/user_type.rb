# frozen_string_literal: true

module Types
  class Objects::UserType < Types::BaseObject
    implements GraphQL::Types::Relay::Node

    field :user_role, Types::Enums::UserRoleEnum, null: false
    field :first_name, String, null: false
    field :last_name, String, null: false
    # field :time_zone, String, null: false # TODO tz type?
    # field :email, String, null: false # TODO authenticate this

    field(
      :organizations,
      Connections::MembershipConnectionType,
      null: false
      # authorized_scope: true
    )
    def organizations
      object.memberships.includes(:organization).order("organizations.name")
    end

    field :created_at, GraphQL::Types::ISO8601DateTime, null: false # TODO authenticate this
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false # TODO authenticate this
  end
end
