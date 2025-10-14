# frozen_string_literal: true

module Types
  class BaseInputObject < GraphQL::Schema::InputObject
    argument_class Types::BaseArgument

    # https://graphql-ruby.org/authorization/visibility
    def self.inherited(subclass)
      super

      if subclass.name&.include?("::Inputs::InternalAdmin::")
        subclass.graphql_name("InternalAdmin#{subclass.name.demodulize.delete_suffix("Type")}")
        subclass.define_singleton_method(:visible?) do |context|
          super(context) && context[:visibility_profile] == :internal_admin
        end
      end
    end
  end
end
