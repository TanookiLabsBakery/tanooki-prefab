# frozen_string_literal: true

class ChannelPolicy < ApplicationPolicy
  def create?
    user.present? && user.organization_id.present? && user.organization_id == record.organization_id
  end

  def destroy?
    user.present? && user.organization_id.present? && user.organization_id == record.organization_id
  end
end
