# frozen_string_literal: true

module Types
  class BaseObject < GraphQL::Schema::Object
    edge_type_class(Types::BaseEdge)
    connection_type_class(Types::BaseConnection)
    field_class Types::BaseField
    include ActionPolicy::GraphQL::Behaviour

    # https://graphql-ruby.org/authorization/visibility
    def self.inherited(subclass)
      super

      if subclass.name&.include?("::InternalAdmin::")
        subclass.graphql_name("InternalAdmin#{subclass.name.demodulize.delete_suffix("Type")}")
        subclass.define_singleton_method(:visible?) do |context|
          super(context) && context[:visibility_profile] == :internal_admin
        end
      end
    end
  end
end
