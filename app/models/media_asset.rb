# == Schema Information
#
# Table name: media_assets
#
#  id              :string           not null, primary key
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  organization_id :string           not null
#
# Indexes
#
#  index_media_assets_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#
class MediaAsset < ApplicationRecord
  cool_id prefix: "med"

  belongs_to :organization
  has_one_attached :file
end
