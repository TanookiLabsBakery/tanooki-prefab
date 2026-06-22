# frozen_string_literal: true

class AiPolicy < ApplicationPolicy
  def access?
    McpAuthorizer.can_access_ai_features?(user)
  end
end
