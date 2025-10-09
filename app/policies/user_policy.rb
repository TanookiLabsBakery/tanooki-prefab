class UserPolicy < ApplicationPolicy
  def update?
    user&.user_role_system_admin? || record == user
  end

  def administrate?
    user&.user_role_system_admin?
  end

  alias_rule :show?, :view_full_user?, to: :update?
  alias_rule :index, to: :administrate?

  relation_scope do |scope|
    if user&.user_role_system_admin?
      scope.kept
    else
      scope.none
    end
  end
end
