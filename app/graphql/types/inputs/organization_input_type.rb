# frozen_string_literal: true

module Types
  class Inputs::OrganizationInputType < Types::BaseInputObject
    argument :brand_voice_guidelines, String, required: false
  end
end
