# frozen_string_literal: true

module Types
  class Inputs::PostInputType < Types::BaseInputObject
    argument :channel_variants, [Inputs::PostChannelVariantInputType], required: true
    argument :scheduled_at, GraphQL::Types::ISO8601DateTime, required: false
  end
end
