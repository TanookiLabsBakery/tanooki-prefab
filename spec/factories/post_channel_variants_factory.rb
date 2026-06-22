FactoryBot.define do
  factory :post_channel_variant do
    post
    channel
    body { "Sample post body" }
  end
end
