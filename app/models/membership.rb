class Membership < ApplicationRecord
  include Discard::Model
  cool_id(prefix: "mem")

  pg_enum :membership_role, ["organization_admin", "default"]

  belongs_to :organization
  belongs_to :user

  validates :user_id, uniqueness: {scope: :organization_id, message: "has already been taken"}
end
