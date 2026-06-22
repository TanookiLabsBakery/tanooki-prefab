# == Schema Information
#
# Table name: users
#
#  id                                  :string           not null, primary key
#  access_count_to_reset_password_page :integer          default(0)
#  crypted_password                    :string
#  discarded_at                        :datetime
#  email                               :citext           not null
#  first_name                          :string           not null
#  last_name                           :string           not null
#  onboarding_completed_at             :datetime
#  remember_me_token                   :string
#  remember_me_token_expires_at        :datetime
#  reset_password_email_sent_at        :datetime
#  reset_password_token                :string
#  reset_password_token_expires_at     :datetime
#  salt                                :string
#  time_zone                           :string           not null
#  user_role                           :enum             default("default"), not null
#  user_status                         :enum             default("active"), not null
#  created_at                          :datetime         not null
#  updated_at                          :datetime         not null
#  organization_id                     :string
#
# Indexes
#
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_organization_id       (organization_id)
#  index_users_on_remember_me_token     (remember_me_token)
#  index_users_on_reset_password_token  (reset_password_token)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#
class User < ApplicationRecord
  include Discard::Model

  authenticates_with_sorcery!
  cool_id(prefix: "usr")

  pg_enum :user_role, ["system_admin", "default", "contributor", "editor", "admin"]
  pg_enum :user_status, ["invited", "active", "blocked"]

  belongs_to :organization, optional: true

  after_create :create_default_organization

  has_many :user_auth_challenges, dependent: :destroy
  has_many :user_auth_tokens, dependent: :destroy

  has_one_attached :avatar do |attachable|
    attachable.variant :thumb, resize_to_limit: [180, 180], preprocessed: true
  end

  validates :first_name, :last_name, presence: true
  validates :time_zone, inclusion: {in: TZInfo::Timezone.all_identifiers}

  normalizes :email, with: ->(value) { value.downcase.strip }
  normalizes :first_name, :last_name, with: ->(value) { value.strip }

  def full_name
    [first_name, last_name].compact.join(" ")
  end

  private

  def create_default_organization
    return if organization_id.present?
    org = Organization.create!(name: "#{first_name}'s Workspace")
    update_column(:organization_id, org.id)
  end

  def email_address
    address = Mail::Address.new
    address.display_name = full_name
    address.address = email
    address
  end

  def email_formatted
    email_address.to_s
  end
end
