FactoryBot.define do
  factory :post_analytic do
    post_channel_variant
    impressions { 100 }
    likes { 10 }
    comments { 2 }
    shares { 1 }
    reposts { 5 }
    fetched_at { Time.current }
  end
end
