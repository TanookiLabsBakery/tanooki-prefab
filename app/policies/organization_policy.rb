class OrganizationPolicy < ApplicationPolicy
  def update_brand_voice?
    user.present? &&
      same_organization? &&
      (user.user_role_admin? || user.user_role_system_admin?)
  end

  private

  def same_organization?
    user.organization_id == record.id
  end
end
