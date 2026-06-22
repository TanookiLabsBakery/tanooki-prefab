# frozen_string_literal: true

# ActionPolicy configuration.
#
# MCP (AI service) authorization uses AiPolicy, which delegates to McpAuthorizer
# to gate access based on user status and organization membership. This mirrors
# the social:access scope concept — callers must satisfy AiPolicy#access? before
# any AI service is invoked.
#
# Usage in GraphQL resolvers:
#   authorize! :ai, to: :access?, with: AiPolicy
#
# Extend McpAuthorizer in the future to check organization subscription tier
# or a feature flag before granting access to AI features.

require "mcp_authorizer"
