class UserPolicy < ApplicationPolicy
  def update?
    user&.user_role_system_admin? || record == user
  end

  alias_rule :show?, :view_full_user?, :index?, to: :update?

  relation_scope do |scope|
    if user&.user_role_system_admin?
      scope.kept
    else
      scope.none
    end
  end
end
