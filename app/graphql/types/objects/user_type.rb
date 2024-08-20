# frozen_string_literal: true

module Types
  class Objects::UserType < Types::BaseObject
    implements GraphQL::Types::Relay::Node

    field :first_name, String, null: false
    field :last_name, String, null: false
    # field :time_zone, String, null: false # TODO tz type?
    # field :email, String, null: false # TODO authenticate this

    field :created_at, GraphQL::Types::ISO8601DateTime, null: false # TODO authenticate this
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false # TODO authenticate this
  end
end
