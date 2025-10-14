# frozen_string_literal: true

module Mutations
  class BaseMutation < GraphQL::Schema::RelayClassicMutation
    argument_class Types::BaseArgument
    field_class Types::BaseField
    input_object_class Types::BaseInputObject
    object_class Types::BaseObject

    null(false)
    include ActionPolicy::GraphQL::Behaviour

    # https://graphql-ruby.org/authorization/visibility
    def self.inherited(subclass)
      super

      if subclass.name&.include?("::InternalAdmin::")
        subclass.graphql_name("InternalAdmin#{subclass.name.demodulize}")
        subclass.define_singleton_method(:visible?) do |context|
          super(context) && context[:visibility_profile] == :internal_admin
        end
      end
    end
  end
end
