# == Schema Information
#
# Table name: post_channel_variants
#
#  id         :string           not null, primary key
#  body       :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  channel_id :string           not null
#  post_id    :string           not null
#
# Indexes
#
#  index_post_channel_variants_on_channel_id  (channel_id)
#  index_post_channel_variants_on_post_id     (post_id)
#
# Foreign Keys
#
#  fk_rails_...  (channel_id => channels.id)
#  fk_rails_...  (post_id => posts.id)
#
class PostChannelVariant < ApplicationRecord
  cool_id prefix: "pcv"

  belongs_to :post
  belongs_to :channel
  has_one :post_analytic, dependent: :destroy
end
