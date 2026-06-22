# frozen_string_literal: true

module Types
  class Objects::MediaAssetType < Types::BaseObject
    implements GraphQL::Types::Relay::Node

    field :url, String, null: true
    field :filename, String, null: false
    field :content_type, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false

    def url
      return unless object.file.attached?
      Rails.application.routes.url_helpers.rails_storage_proxy_url(object.file.key)
    end

    def filename
      object.file.attached? ? object.file.filename.to_s : ""
    end

    def content_type
      object.file.attached? ? object.file.content_type : nil
    end
  end
end
