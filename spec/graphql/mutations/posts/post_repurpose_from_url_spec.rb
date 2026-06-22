require "rails_helper"

RSpec.describe Mutations::Posts::PostRepurposeFromUrl, type: :request do
  let(:mutation) do
    <<~GRAPHQL
      mutation PostRepurposeFromUrl($input: PostRepurposeFromUrlInput!) {
        postRepurposeFromUrl(input: $input) {
          variants {
            channelId
            body
          }
        }
      }
    GRAPHQL
  end

  let(:fake_html) do
    <<~HTML
      <html>
        <head><title>Amazing Blog Post</title></head>
        <body>This is the article content about our new product launch.</body>
      </html>
    HTML
  end

  let(:fake_httparty_response) do
    instance_double(HTTParty::Response, body: fake_html)
  end

  before do
    allow(HTTParty).to receive(:get).and_return(fake_httparty_response)
  end

  context "as a user with an organization" do
    it "returns AI-generated variants based on the URL content" do
      organization = create(:organization)
      user = create(:user, organization: organization)
      channel_1 = create(:channel, organization: organization)
      channel_2 = create(:channel, organization: organization)

      generated_variants = [
        Mcp::GenerateVariantsService::PostVariant.new(channel_id: channel_1.id, body: "Bluesky variant from URL"),
        Mcp::GenerateVariantsService::PostVariant.new(channel_id: channel_2.id, body: "Threads variant from URL")
      ]

      allow_any_instance_of(Mcp::GenerateVariantsService).to receive(:call).and_return(generated_variants)

      result = graphql_execute(
        mutation,
        current_user: user,
        variables: {
          input: {
            url: "https://example.com/blog/post",
            channelIds: [channel_1.id, channel_2.id]
          }
        }
      )

      variants = result.dig("data", "postRepurposeFromUrl", "variants")
      expect(variants.length).to eq(2)
      expect(variants[0]["channelId"]).to eq(channel_1.id)
      expect(variants[0]["body"]).to eq("Bluesky variant from URL")
      expect(variants[1]["channelId"]).to eq(channel_2.id)
      expect(variants[1]["body"]).to eq("Threads variant from URL")
    end

    it "fetches the URL and passes extracted content to the AI service" do
      organization = create(:organization)
      user = create(:user, organization: organization)
      channel = create(:channel, organization: organization)

      service_instance = instance_double(Mcp::GenerateVariantsService)
      allow(service_instance).to receive(:call).and_return([
        Mcp::GenerateVariantsService::PostVariant.new(channel_id: channel.id, body: "Generated variant")
      ])

      allow(Mcp::GenerateVariantsService).to receive(:new).with(
        shared_text: "Amazing Blog Post\n\nThis is the article content about our new product launch.",
        channels: anything,
        organization: organization
      ).and_return(service_instance)

      graphql_execute(
        mutation,
        current_user: user,
        variables: {
          input: {
            url: "https://example.com/blog/post",
            channelIds: [channel.id]
          }
        }
      )

      expect(HTTParty).to have_received(:get).with("https://example.com/blog/post", timeout: 10)
      expect(Mcp::GenerateVariantsService).to have_received(:new).with(
        shared_text: "Amazing Blog Post\n\nThis is the article content about our new product launch.",
        channels: anything,
        organization: organization
      )
    end
  end

  context "when channel ids from another organization are provided" do
    it "only passes organization-scoped channels to the service" do
      organization = create(:organization)
      other_organization = create(:organization)
      user = create(:user, organization: organization)
      own_channel = create(:channel, organization: organization)
      other_channel = create(:channel, organization: other_organization)

      service_instance = instance_double(Mcp::GenerateVariantsService)
      allow(service_instance).to receive(:call).and_return([
        Mcp::GenerateVariantsService::PostVariant.new(channel_id: own_channel.id, body: "Generated variant")
      ])
      allow(Mcp::GenerateVariantsService).to receive(:new).and_return(service_instance)

      graphql_execute(
        mutation,
        current_user: user,
        variables: {
          input: {
            url: "https://example.com/blog/post",
            channelIds: [own_channel.id, other_channel.id]
          }
        }
      )

      expect(Mcp::GenerateVariantsService).to have_received(:new).with(
        hash_including(channels: satisfy { |c| c.pluck(:id) == [own_channel.id] })
      )
    end
  end
end
