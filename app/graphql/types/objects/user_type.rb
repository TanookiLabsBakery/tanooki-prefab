# frozen_string_literal: true

module Types
  class Objects::UserType < Types::BaseObject
    implements GraphQL::Types::Relay::Node

    field :user_role, Enums::UserRoleType, null: false
    field :user_status, Enums::UserStatusType, null: false
    field :first_name, String, null: false
    field :last_name, String, null: false
    field :email, String, null: true, authorize_field: {to: :view_full_user?}

    field :full_name, String, null: false

    field :created_at, GraphQL::Types::ISO8601DateTime, null: true, authorize_field: {to: :view_full_user?}
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: true, authorize_field: {to: :view_full_user?}

    field :avatar_url, String, null: true
    def avatar_url
      Rails.application.routes.url_helpers.rails_storage_proxy_url(object.avatar.key) if object.avatar.attached?
    end

    field :avatar_thumb_url, String, null: true
    def avatar_thumb_url
      Rails.application.routes.url_helpers.rails_storage_proxy_url(object.avatar.variant(:thumb)) if object.avatar.attached?
    end
  end
end
