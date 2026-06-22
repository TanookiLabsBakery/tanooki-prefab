puts "Seeding demo organization..."

organization = Organization.find_or_create_by!(name: "Acme Co")

puts "Seeding users..."

admin = User.find_or_create_by!(email: "admin@example.com") do |user|
  user.first_name = "Admin"
  user.last_name = "User"
  user.password = "password123"
  user.user_role = "system_admin"
  user.user_status = "active"
  user.time_zone = "America/New_York"
  user.organization = organization
  user.onboarding_completed_at = Time.current
end
admin.update!(organization: organization, onboarding_completed_at: Time.current) if admin.organization_id != organization.id || admin.onboarding_completed_at.nil?

standard_user = User.find_or_create_by!(email: "user@example.com") do |user|
  user.first_name = "Test"
  user.last_name = "User"
  user.password = "password123"
  user.user_role = "default"
  user.user_status = "active"
  user.time_zone = "America/New_York"
  user.organization = organization
  user.onboarding_completed_at = Time.current
end
standard_user.update!(organization: organization, onboarding_completed_at: Time.current) if standard_user.organization_id != organization.id || standard_user.onboarding_completed_at.nil?

puts "Seeding credentials and channels..."

bluesky_credential = Credential.find_or_create_by!(organization: organization, provider: "bluesky")
threads_credential = Credential.find_or_create_by!(organization: organization, provider: "threads")

bluesky_channel = Channel.find_or_create_by!(organization: organization, remote_id: "did:plc:acmeco-seed") do |channel|
  channel.name = "Acme Co"
  channel.provider = "bluesky"
  channel.credential = bluesky_credential
end

threads_channel = Channel.find_or_create_by!(organization: organization, remote_id: "acmeco.threads.seed") do |channel|
  channel.name = "Acme Co"
  channel.provider = "threads"
  channel.credential = threads_credential
end

puts "Seeding posts..."

unless Post.where(organization: organization).exists?
  draft_post = Post.create!(organization: organization, status: "draft")
  PostChannelVariant.create!(
    post: draft_post,
    channel: bluesky_channel,
    body: "Working on something exciting for our community — stay tuned for the big reveal next week! 🚀"
  )
  PostChannelVariant.create!(
    post: draft_post,
    channel: threads_channel,
    body: "Something exciting is coming. Can't say more just yet, but we think you'll love it."
  )

  scheduled_post = Post.create!(
    organization: organization,
    status: "scheduled",
    scheduled_at: 3.days.from_now.beginning_of_hour
  )
  PostChannelVariant.create!(
    post: scheduled_post,
    channel: bluesky_channel,
    body: "Big news dropping this Thursday! Make sure you're following so you don't miss it. #ProductLaunch"
  )
  PostChannelVariant.create!(
    post: scheduled_post,
    channel: threads_channel,
    body: "Mark your calendars — something big is coming Thursday morning. Follow us to be the first to know!"
  )

  needs_approval_post = Post.create!(organization: organization, status: "needs_approval")
  PostChannelVariant.create!(
    post: needs_approval_post,
    channel: bluesky_channel,
    body: "We're thrilled to announce our partnership with @partner.bsky.social — together we're building the future of decentralized social. Learn more at acme.co/partnership"
  )
  PostChannelVariant.create!(
    post: needs_approval_post,
    channel: threads_channel,
    body: "Big partnership announcement! We've teamed up with a leader in the space to bring you even better tools. Full details at acme.co/partnership"
  )

  [
    {
      scheduled_at: 14.days.ago,
      bluesky_body: "Introducing Acme Co — the simplest way to manage all your social channels in one place. Sign up free today at acme.co #SocialMedia #Productivity",
      threads_body: "We're live! Acme Co is the easiest way to manage Bluesky, Threads, and Mastodon from a single dashboard. Try it free.",
      bluesky_analytics: {impressions: 4_823, likes: 312, comments: 47, shares: 89, reposts: 156},
      threads_analytics: {impressions: 6_104, likes: 489, comments: 71, shares: 112, reposts: 203}
    },
    {
      scheduled_at: 7.days.ago,
      bluesky_body: "3 tips for growing your audience on decentralized social:\n1. Post consistently\n2. Engage with replies\n3. Cross-post thoughtfully\nWhat would you add? #BlueSky #SocialTips",
      threads_body: "3 tips for growing your Threads audience:\n1. Post consistently\n2. Engage with replies\n3. Repurpose your best content\nDrop your tip below 👇",
      bluesky_analytics: {impressions: 9_241, likes: 734, comments: 128, shares: 203, reposts: 445},
      threads_analytics: {impressions: 14_382, likes: 1_201, comments: 247, shares: 388, reposts: 619}
    },
    {
      scheduled_at: 2.days.ago,
      bluesky_body: "We just shipped bulk scheduling! Queue up an entire week of content in minutes. Available now for all users → acme.co/changelog",
      threads_body: "New feature alert 🚨 Bulk scheduling is here. Plan a full week of posts across all your channels in just a few clicks. Live now!",
      bluesky_analytics: {impressions: 6_102, likes: 498, comments: 63, shares: 141, reposts: 227},
      threads_analytics: {impressions: 8_830, likes: 712, comments: 94, shares: 198, reposts: 341}
    }
  ].each do |post_data|
    published_post = Post.create!(
      organization: organization,
      status: "published",
      scheduled_at: post_data[:scheduled_at]
    )

    bluesky_variant = PostChannelVariant.create!(
      post: published_post,
      channel: bluesky_channel,
      body: post_data[:bluesky_body]
    )
    PostAnalytic.create!(
      post_channel_variant: bluesky_variant,
      fetched_at: Time.current,
      **post_data[:bluesky_analytics]
    )

    threads_variant = PostChannelVariant.create!(
      post: published_post,
      channel: threads_channel,
      body: post_data[:threads_body]
    )
    PostAnalytic.create!(
      post_channel_variant: threads_variant,
      fetched_at: Time.current,
      **post_data[:threads_analytics]
    )
  end
end

puts "Seed complete: 2 users, 1 organization, 2 channels, #{Post.where(organization: organization).count} posts, #{PostAnalytic.count} analytics records."
