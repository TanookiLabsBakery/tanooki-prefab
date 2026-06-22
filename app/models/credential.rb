# == Schema Information
#
# Table name: credentials
#
#  id              :string           not null, primary key
#  access_token    :text
#  expires_at      :text
#  provider        :string           not null
#  refresh_token   :text
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  organization_id :string           not null
#
# Indexes
#
#  index_credentials_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#
class Credential < ApplicationRecord
  cool_id prefix: "crd"

  belongs_to :organization

  encrypts :access_token
  encrypts :refresh_token
  encrypts :expires_at

  validates :provider, presence: true
end
