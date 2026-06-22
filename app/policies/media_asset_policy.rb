# frozen_string_literal: true

class MediaAssetPolicy < ApplicationPolicy
  def create?
    user.present? && user.organization_id.present? && user.organization_id == record.organization_id
  end

  def index?
    user.present? && user.organization_id.present?
  end
end
