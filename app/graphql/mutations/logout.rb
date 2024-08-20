# frozen_string_literal: true

module Mutations
  class Logout < BaseMutation
    field :success, Boolean, null: false

    def resolve
      user = context[:current_user]
      if user
        context[:logout].call
        {success: true}
      else
        raise GraphQL::ExecutionError.new("Not authenticated")
      end
    end
  end
end
