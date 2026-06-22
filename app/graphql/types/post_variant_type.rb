# frozen_string_literal: true

module Types
  class PostVariantType < Types::BaseObject
    field :channel_id, ID, null: false
    field :body, String, null: false
  end
end
