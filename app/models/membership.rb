# == Schema Information
#
# Table name: memberships
#
#  id              :string           not null, primary key
#  discarded_at    :datetime
#  membership_role :enum             default("default"), not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  organization_id :string           not null
#  user_id         :string           not null
#
# Indexes
#
#  index_memberships_on_organization_id              (organization_id)
#  index_memberships_on_user_id                      (user_id)
#  index_memberships_on_user_id_and_organization_id  (user_id,organization_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#  fk_rails_...  (user_id => users.id)
#
class Membership < ApplicationRecord
  include Discard::Model
  cool_id(prefix: "mem")

  pg_enum :membership_role, ["organization_admin", "default"]

  belongs_to :organization
  belongs_to :user

  validates :user_id, uniqueness: {scope: :organization_id, message: "has already been taken"}
end
