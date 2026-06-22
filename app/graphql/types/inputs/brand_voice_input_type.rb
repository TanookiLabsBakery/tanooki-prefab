# frozen_string_literal: true

module Types
  class Inputs::BrandVoiceInputType < Types::BaseInputObject
    argument :tone, String, required: false
    argument :messaging_pillars, [String], required: false
    argument :words_to_avoid, [String], required: false
    argument :approved_hashtag_sets, [String], required: false
  end
end
