class User < ApplicationRecord
  authenticates_with_sorcery!
  cool_id(prefix: "usr")

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :time_zone, inclusion: {in: TZInfo::Timezone.all_identifiers}

  normalizes :first_name, with: ->(value) { value.strip }
  normalizes :last_name, with: ->(value) { value.strip }
  normalizes :email, with: ->(value) { value.downcase.strip }

  def full_name
    [first_name, last_name].compact.join(" ")
  end

  def email_address
    address = Mail::Address.new
    address.display_name = full_name
    address.address = email
    address
  end

  def email_formatted
    email_address.to_s
  end
end
