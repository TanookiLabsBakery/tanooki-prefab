FactoryBot.define do
  factory :user do
    first_name { "John" }
    last_name { "Doe" }
    time_zone { "UTC" }
    sequence(:email) { |n| "user#{n}@example.com" }
  end
end
