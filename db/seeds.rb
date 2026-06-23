puts "Seeding demo organization..."

organization = Organization.find_or_create_by!(name: "Tanooki Labs")

puts "Seeding users..."

admin = User.find_or_create_by!(email: "admin@example.com") do |user|
  user.first_name = "Dave"
  user.last_name = "Renz"
  user.password = "password123"
  user.user_role = "system_admin"
  user.user_status = "active"
  user.time_zone = "America/New_York"
  user.organization = organization
  user.onboarding_completed_at = Time.current
end
admin.update!(
  first_name: "Dave",
  last_name: "Renz",
  organization: organization,
  onboarding_completed_at: admin.onboarding_completed_at || Time.current
)

standard_user = User.find_or_create_by!(email: "user@example.com") do |user|
  user.first_name = "Sarah"
  user.last_name = "Kim"
  user.password = "password123"
  user.user_role = "default"
  user.user_status = "active"
  user.time_zone = "America/New_York"
  user.organization = organization
  user.onboarding_completed_at = Time.current
end
standard_user.update!(
  first_name: "Sarah",
  last_name: "Kim",
  organization: organization,
  onboarding_completed_at: standard_user.onboarding_completed_at || Time.current
)

[
  {first_name: "Mike", last_name: "Chen", email: "mike.chen@tanookilabs.com"},
  {first_name: "Jordan", last_name: "Brooks", email: "jordan.brooks@tanookilabs.com"},
  {first_name: "Alex", last_name: "Torres", email: "alex.torres@tanookilabs.com"}
].each do |attrs|
  user = User.find_or_create_by!(email: attrs[:email]) do |u|
    u.first_name = attrs[:first_name]
    u.last_name = attrs[:last_name]
    u.password = "password123"
    u.user_role = "default"
    u.user_status = "active"
    u.time_zone = "America/New_York"
    u.organization = organization
    u.onboarding_completed_at = Time.current
  end
  user.update!(organization: organization, onboarding_completed_at: user.onboarding_completed_at || Time.current)
end

puts "Seeding credentials and channels..."

bluesky_credential = Credential.find_or_create_by!(organization: organization, provider: "bluesky")
threads_credential = Credential.find_or_create_by!(organization: organization, provider: "threads")

bluesky_channel = Channel.find_or_create_by!(organization: organization, remote_id: "did:plc:tanookilabs-seed") do |channel|
  channel.name = "Tanooki Labs"
  channel.provider = "bluesky"
  channel.credential = bluesky_credential
end

threads_channel = Channel.find_or_create_by!(organization: organization, remote_id: "tanookilabs.threads.seed") do |channel|
  channel.name = "Tanooki Labs"
  channel.provider = "threads"
  channel.credential = threads_credential
end

puts "Seeding posts..."

unless Post.where(organization: organization).exists?
  draft_post = Post.create!(organization: organization, status: "draft")
  PostChannelVariant.create!(
    post: draft_post,
    channel: bluesky_channel,
    body: "On AI in healthcare: we co-wrote a piece with the engineering team at Meridian Health Partners about how care coordination actually works at scale. Link in bio. #AIinHealthcare #HealthTech"
  )
  PostChannelVariant.create!(
    post: draft_post,
    channel: threads_channel,
    body: "On AI in healthcare: our team co-wrote a piece with the engineering team at a leading care coordination platform. What it actually takes to get AI into clinical workflows — the parts no one writes about. Link in bio."
  )

  scheduled_post = Post.create!(
    organization: organization,
    status: "scheduled",
    scheduled_at: 3.days.from_now.beginning_of_hour
  )
  PostChannelVariant.create!(
    post: scheduled_post,
    channel: bluesky_channel,
    body: "Big announcement Thursday — a new engagement we're really excited about 👀 Follow along."
  )
  PostChannelVariant.create!(
    post: scheduled_post,
    channel: threads_channel,
    body: "Big announcement Thursday. A new engagement we're genuinely excited about — stay tuned 👀"
  )

  needs_approval_post = Post.create!(organization: organization, status: "needs_approval")
  PostChannelVariant.create!(
    post: needs_approval_post,
    channel: bluesky_channel,
    body: "Thrilled to announce our partnership with @voxxmedia — we're building the content intelligence layer for their entire podcast and newsletter portfolio. Twelve shows, eight newsletters, one unified AI backbone. #ContentOps #AIMedia"
  )
  PostChannelVariant.create!(
    post: needs_approval_post,
    channel: threads_channel,
    body: "We're building something we're really proud of with the team at Voxx Media Group — an AI-powered content operations layer across their full portfolio of 12 podcasts and 8 newsletters. More details soon, but it's the most technically interesting media project we've taken on. Grateful for partners who push us."
  )

  [
    {
      scheduled_at: 14.days.ago,
      bluesky_body: "We just wrapped Month 1 with our newest client in Pittsburgh — here's what AI vision inspection actually looks like on a factory floor. Spoiler: it's less glamorous and more impressive than you'd expect. #AIManufacturing #IndustrialAI",
      threads_body: "We just wrapped Month 1 with our newest client — an industrial automation company in Pittsburgh building AI-powered defect detection for their production line. What it actually looks like on the factory floor is not what you'd imagine from the pitch decks. Thread on what we learned 👇",
      bluesky_analytics: {impressions: 5_102, likes: 387, comments: 54, shares: 98, reposts: 172},
      threads_analytics: {impressions: 7_841, likes: 612, comments: 93, shares: 144, reposts: 268}
    },
    {
      scheduled_at: 7.days.ago,
      bluesky_body: "Hiring! We're looking for a senior Rails engineer to join the Tanooki Labs team. Remote-first. Real clients. Real work. No 'move fast' — we ship carefully. tanookilabs.com/careers #RubyOnRails #Hiring",
      threads_body: "We're hiring a senior Rails engineer. Remote-first, real clients (healthcare, fintech, media), and a team that actually cares about the craft. We're 15 people and plan to stay that way for a while. DM or hit the link in bio if you're interested.",
      bluesky_analytics: {impressions: 9_804, likes: 821, comments: 147, shares: 234, reposts: 503},
      threads_analytics: {impressions: 15_230, likes: 1_347, comments: 289, shares: 411, reposts: 688}
    },
    {
      scheduled_at: 2.days.ago,
      bluesky_body: "Content automation and AI tagging at scale — we helped the team at Voxx Media build a system that classifies and surfaces clips across 12 shows. The surprising part: the hardest problem wasn't the ML. #ContentOps #NLP",
      threads_body: "We helped a media company with 12 podcasts and 8 newsletters build an AI tagging and content discovery system. The ML piece took 3 weeks. The editorial taxonomy debate took 6. If you've ever tried to get producers to agree on what a 'topic' is, you understand.",
      bluesky_analytics: {impressions: 6_440, likes: 512, comments: 78, shares: 161, reposts: 244},
      threads_analytics: {impressions: 9_115, likes: 739, comments: 108, shares: 207, reposts: 362}
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

puts "Seed complete: #{User.count} users, 1 organization (Tanooki Labs), 2 channels (@tanookilabs), #{Post.where(organization: organization).count} posts, #{PostAnalytic.count} analytics records."
