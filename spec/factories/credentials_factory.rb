FactoryBot.define do
  factory :credential do
    organization
    provider { "bluesky" }
    access_token { "access_token_value" }
  end
end
