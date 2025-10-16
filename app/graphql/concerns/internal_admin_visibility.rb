# frozen_string_literal: true

module InternalAdminVisibility
  extend ActiveSupport::Concern

  class_methods do
    def inherited(subclass)
      super

      if subclass.name&.include?("::InternalAdmin::")
        # adds an 'InternalAdmin' suffix to the class name
        base_name = subclass.name.demodulize.delete_suffix("Type")
        subclass.graphql_name("InternalAdmin#{base_name}")

        # if this object is in the InternalAdmin namespace, use the :internal_admin visibility profile
        # https://graphql-ruby.org/authorization/visibility
        subclass.define_singleton_method(:visible?) do |context|
          super(context) && context[:visibility_profile] == :internal_admin
        end
      end
    end
  end
end
