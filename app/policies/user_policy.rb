class UserPolicy < ApplicationPolicy
  def show?
    user&.user_role_system_admin? || record == user
  end

  def update?
    user&.user_role_system_admin? || record == user
  end

  relation_scope do |scope|
    if user&.user_role_system_admin?
      scope.kept
    else
      scope.none
    end
  end
end
