# frozen_string_literal: true

# McpAuthorizer determines whether a user has access to MCP (AI service) features.
#
# Access is currently granted to any authenticated, non-blocked user who belongs
# to an organization. In the future this can be extended to gate on organization
# subscription tier or a social:access feature flag.
module McpAuthorizer
  def self.can_access_ai_features?(user)
    return false if user.blank?
    return false if user.organization.blank?

    user.user_status_active?
  end
end
