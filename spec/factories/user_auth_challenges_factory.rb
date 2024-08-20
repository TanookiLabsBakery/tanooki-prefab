FactoryBot.define do
  factory :user_auth_challenge do
    association :user
    token { UserAuthChallenge.generate_token }
    timeout_at { 10.minutes.from_now }
    client_auth_code { SecureRandom.uuid }

    trait :expired do
      timeout_at { 1.minute.ago }
    end
  end
end
