# frozen_string_literal: true

module Mutations
  class CompleteOnboarding < BaseMutation
    description "Mark the current user's onboarding as complete"

    field :viewer, Types::Objects::UserType, null: false

    def resolve
      current_user = context[:current_user]
      raise GraphQL::ExecutionError, "Not authenticated" unless current_user

      current_user.update!(onboarding_completed_at: Time.current) unless current_user.onboarding_completed_at.present?

      {viewer: current_user}
    end
  end
end
