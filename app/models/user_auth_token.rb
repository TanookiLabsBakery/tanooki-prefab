class UserAuthToken < ApplicationRecord
  cool_id prefix: "uat", length: 20

  has_secure_token

  belongs_to :user
end
