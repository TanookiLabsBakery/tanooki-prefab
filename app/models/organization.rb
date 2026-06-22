# == Schema Information
#
# Table name: organizations
#
#  id                     :string           not null, primary key
#  brand_voice_guidelines :text
#  name                   :string           not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#
class Organization < ApplicationRecord
  cool_id prefix: "org"

  has_many :users, dependent: :nullify
  has_many :credentials, dependent: :destroy

  validates :name, presence: true
end
