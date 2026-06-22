# frozen_string_literal: true

module Types
  class Inputs::PostChannelVariantInputType < Types::BaseInputObject
    argument :channel_id, ID, required: true
    argument :body, String, required: false
  end
end
