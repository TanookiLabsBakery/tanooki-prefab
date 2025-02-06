# == Schema Information
#
# Table name: organizations
#
#  id                :string           not null, primary key
#  discarded_at      :datetime
#  name              :string           not null
#  organization_type :enum             default("standard"), not null
#  slug              :string           not null
#  time_zone         :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
# Indexes
#
#  index_organizations_on_organization_type  (organization_type) UNIQUE WHERE (organization_type = 'system'::organization_type)
#
class Organization < ApplicationRecord
  include Discard::Model
  cool_id(prefix: "org")

  pg_enum :organization_type, ["system", "standard", "personal"]

  validates :name, :slug, :time_zone, presence: true
  validates :time_zone, inclusion: {in: TZInfo::Timezone.all_identifiers}

  before_validation :set_slug

  normalizes :name, with: ->(value) { value.strip }

  has_many :memberships, dependent: :destroy
  has_many :users, through: :memberships

  def self.system_organization
    existing = find_by(organization_type: "system")
    return existing if existing
    create!(name: "System Organization", organization_type: "system", time_zone: "UTC")
  end

  private

  def set_slug
    self.slug = name.parameterize if name.present?
  end
end
