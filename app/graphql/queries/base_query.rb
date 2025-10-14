module Queries
  class BaseQuery < GraphQL::Schema::Resolver
    include ActionPolicy::GraphQL::Behaviour

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
