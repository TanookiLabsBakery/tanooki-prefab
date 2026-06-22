# == Schema Information
#
# Table name: post_analytics
#
#  id                      :string           not null, primary key
#  comments                :integer          default(0), not null
#  fetched_at              :datetime
#  impressions             :integer          default(0), not null
#  likes                   :integer          default(0), not null
#  reposts                 :integer          default(0), not null
#  shares                  :integer          default(0), not null
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  post_channel_variant_id :string           not null
#
# Indexes
#
#  index_post_analytics_on_post_channel_variant_id  (post_channel_variant_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (post_channel_variant_id => post_channel_variants.id)
#
class PostAnalytic < ApplicationRecord
  cool_id prefix: "pan"

  belongs_to :post_channel_variant

  validates :post_channel_variant, uniqueness: true
  validates :impressions, numericality: {greater_than_or_equal_to: 0}
  validates :likes, numericality: {greater_than_or_equal_to: 0}
  validates :comments, numericality: {greater_than_or_equal_to: 0}
  validates :shares, numericality: {greater_than_or_equal_to: 0}
  validates :reposts, numericality: {greater_than_or_equal_to: 0}
end
