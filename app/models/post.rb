# == Schema Information
#
# Table name: posts
#
#  id              :string           not null, primary key
#  scheduled_at    :datetime
#  status          :enum             default("draft"), not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  organization_id :string           not null
#  sidekiq_job_id  :string
#
# Indexes
#
#  index_posts_on_organization_id  (organization_id)
#  index_posts_on_sidekiq_job_id   (sidekiq_job_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#
class Post < ApplicationRecord
  cool_id prefix: "post"

  belongs_to :organization
  has_many :post_channel_variants, dependent: :destroy
  has_many :channels, through: :post_channel_variants

  pg_enum :status, %w[draft scheduled published error needs_approval]

  after_update :notify_approvers_if_needs_approval

  private

  def notify_approvers_if_needs_approval
    return unless saved_change_to_status? && status_needs_approval?

    organization.users.where(user_role: %w[editor admin system_admin]).each do |approver|
      PostApprovalMailer.with(post: self, approver: approver).request_approval_email.deliver_later
    end
  end
end
