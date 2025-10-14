# frozen_string_literal: true

module Types
  class BaseField < GraphQL::Schema::Field
    argument_class Types::BaseArgument

    # https://graphql-ruby.org/authorization/visibility#field-visibility
    def initialize(*args, require_internal_admin: false, **kwargs, &block)
      @require_internal_admin = require_internal_admin
      super(*args, **kwargs, &block)
    end

    # https://graphql-ruby.org/authorization/visibility#field-visibility
    def visible?(context)
      super && (@require_internal_admin ? context[:visibility_profile] == :internal_admin : true)
    end
  end
end
