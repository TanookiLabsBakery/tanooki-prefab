FactoryBot.define do
  factory :channel do
    organization
    credential
    sequence(:name) { |n| "Channel #{n}" }
    provider { "bluesky" }
    sequence(:remote_id) { |n| "remote_#{n}" }
  end
end
