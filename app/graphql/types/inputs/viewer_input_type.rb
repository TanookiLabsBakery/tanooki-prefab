# frozen_string_literal: true

module Types
  class Inputs::ViewerInputType < Types::BaseInputObject
    argument :email, String, required: false
    argument :first_name, String, required: false
    argument :last_name, String, required: false
    argument :time_zone, String, required: false
  end
end
