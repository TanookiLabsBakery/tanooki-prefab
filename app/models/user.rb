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
