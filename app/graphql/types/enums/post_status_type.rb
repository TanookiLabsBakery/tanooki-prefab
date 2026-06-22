# frozen_string_literal: true

module Types
  class Enums::PostStatusType < Types::BaseEnum
    description "Post status enum"
    rails_enum(Post.statuses)
  end
end
