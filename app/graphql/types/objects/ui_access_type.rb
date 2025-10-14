# frozen_string_literal: true

module Types
  class Objects::UiAccessType < Types::BaseObject
    description "UI access permissions for the current user"

    expose_authorization_rules :view?, with: InternalAdminPolicy, field_name: :can_internal_admin
  end
end
