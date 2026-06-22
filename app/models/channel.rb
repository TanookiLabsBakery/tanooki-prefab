# == Schema Information
#
# Table name: channels
#
#  id              :string           not null, primary key
#  name            :string           not null
#  provider        :enum             not null
#  remote_id       :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  credential_id   :string           not null
#  organization_id :string           not null
#
# Indexes
#
#  index_channels_on_credential_id    (credential_id)
#  index_channels_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (credential_id => credentials.id)
#  fk_rails_...  (organization_id => organizations.id)
#
class Channel < ApplicationRecord
  cool_id prefix: "chan"

  belongs_to :organization
  belongs_to :credential

  pg_enum :provider, %w[bluesky mastodon threads]

  validates :name, presence: true
  validates :remote_id, presence: true
end
