# frozen_string_literal: true

class PostPolicy < ApplicationPolicy
  def index?
    user.present? && user.organization_id.present?
  end

  def show?
    user.present? && same_organization?
  end

  def create?
    user.present? && user.organization_id.present? && same_organization?
  end

  def request_approval?
    user.present? && same_organization? && record.status_draft?
  end

  def approve?
    user.present? &&
      same_organization? &&
      approver_role? &&
      record.status_needs_approval?
  end

  def repurpose?
    user.present? && same_organization?
  end

  def reschedule?
    user.present? && same_organization? && record.status_scheduled?
  end

  private

  def same_organization?
    user.organization_id == record.organization_id
  end

  def approver_role?
    user.user_role_editor? || user.user_role_admin? || user.user_role_system_admin?
  end
end
