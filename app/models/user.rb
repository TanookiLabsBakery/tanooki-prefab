# == Schema Information
#
# Table name: users
#
#  id                                  :string           not null, primary key
#  access_count_to_reset_password_page :integer          default(0)
#  crypted_password                    :string
#  discarded_at                        :datetime
#  email                               :string           not null
#  first_name                          :string           not null
#  last_name                           :string           not null
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
#  current_organization_id             :string           not null
#
# Indexes
#
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_remember_me_token     (remember_me_token)
#  index_users_on_reset_password_token  (reset_password_token)
#
class User < ApplicationRecord
  include Discard::Model
  authenticates_with_sorcery!
  cool_id(prefix: "usr")

  pg_enum :user_role, ["system_admin", "default"]
  pg_enum :user_status, ["invited", "active", "blocked"]

  has_many :user_auth_challenges, dependent: :destroy
  has_many :user_auth_tokens, dependent: :destroy
  has_many :memberships, dependent: :destroy
  belongs_to :current_organization, class_name: "Organization"

  has_one_attached :avatar do |attachable|
    attachable.variant :thumb, resize_to_limit: [180, 180], preprocessed: true
  end

  validates :first_name, :last_name, presence: true
  validates :time_zone, inclusion: {in: TZInfo::Timezone.all_identifiers}

  normalizes :email, with: ->(value) { value.downcase.strip }
  normalizes :first_name, :last_name, with: ->(value) { value.strip }

  before_validation :set_current_organization

  def full_name
    [first_name, last_name].compact.join(" ")
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

  private

  def set_current_organization
    unless current_organization.present?
      system_org = Organization.system_organization
      memberships.build(organization: system_org)
      self.current_organization_id = system_org.id
    end
  end
end
