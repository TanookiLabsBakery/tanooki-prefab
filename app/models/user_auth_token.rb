# == Schema Information
#
# Table name: user_auth_tokens
#
#  id         :string           not null, primary key
#  token      :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :string           not null
#
# Indexes
#
#  index_user_auth_tokens_on_token    (token) UNIQUE
#  index_user_auth_tokens_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id) ON DELETE => cascade
#
class UserAuthToken < ApplicationRecord
  cool_id prefix: "uat", length: 20

  has_secure_token

  belongs_to :user
end
