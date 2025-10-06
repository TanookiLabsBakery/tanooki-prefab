# == Schema Information
#
# Table name: user_auth_challenges
#
#  id               :string           not null, primary key
#  claimed_at       :datetime
#  client_auth_code :uuid             not null
#  timeout_at       :datetime         not null
#  token_digest     :string           not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  user_id          :string           not null
#
# Indexes
#
#  index_user_auth_challenges_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class UserAuthChallenge < ApplicationRecord
  include BCrypt

  cool_id prefix: "uac", length: 20

  belongs_to :user
  scope :active, -> { where("timeout_at > ?", Time.current) }

  attr_reader :token

  CHARS = [*"A".."Z", *"0".."9"].freeze

  validates :token_digest, presence: {strict: true}
  validates :user_id, presence: {strict: true}
  validates :timeout_at, presence: {strict: true}
  validates :client_auth_code, format: {with: /\A[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\z/i, message: "must be a valid UUID", strict: true}

  def token=(plaintext)
    self.token_digest = Password.create(plaintext)
    @token = plaintext
  end

  def authenticate(token)
    Password.new(token_digest) == token
  end

  def self.generate_token
    CHARS.sample(6).join
  end

  def self.default_timeout
    5.minutes
  end

  def expired?
    timeout_at <= Time.current
  end
end
