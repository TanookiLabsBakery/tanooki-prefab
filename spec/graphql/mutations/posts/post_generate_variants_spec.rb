require "rails_helper"

RSpec.describe Mutations::Posts::PostGenerateVariants, type: :request do
  let(:mutation) do
    <<~GRAPHQL
      mutation PostGenerateVariants($input: PostGenerateVariantsInput!) {
        postGenerateVariants(input: $input) {
          variants {
            channelId
            body
          }
        }
      }
    GRAPHQL
  end

  context "as a user with an organization" do
    it "returns generated variants for each channel" do
      organization = create(:organization)
      user = create(:user, organization: organization)
      channel_1 = create(:channel, organization: organization)
      channel_2 = create(:channel, organization: organization)

      generated_variants = [
        Mcp::GenerateVariantsService::PostVariant.new(channel_id: channel_1.id, body: "Bluesky variant text"),
        Mcp::GenerateVariantsService::PostVariant.new(channel_id: channel_2.id, body: "Threads variant text")
      ]

      allow_any_instance_of(Mcp::GenerateVariantsService).to receive(:call).and_return(generated_variants)

      result = graphql_execute(
        mutation,
        current_user: user,
        variables: {
          input: {
            sharedText: "Check out our new product launch!",
            channelIds: [channel_1.id, channel_2.id]
          }
        }
      )

      variants = result.dig("data", "postGenerateVariants", "variants")
      expect(variants.length).to eq(2)
      expect(variants[0]["channelId"]).to eq(channel_1.id)
      expect(variants[0]["body"]).to eq("Bluesky variant text")
      expect(variants[1]["channelId"]).to eq(channel_2.id)
      expect(variants[1]["body"]).to eq("Threads variant text")
    end

    it "passes brand voice guidelines and channels to the service" do
      organization = create(:organization, brand_voice_guidelines: '{"tone":"professional"}')
      user = create(:user, organization: organization)
      channel = create(:channel, organization: organization)

      service_instance = instance_double(Mcp::GenerateVariantsService)
      allow(service_instance).to receive(:call).and_return([
        Mcp::GenerateVariantsService::PostVariant.new(channel_id: channel.id, body: "Generated text")
      ])

      allow(Mcp::GenerateVariantsService).to receive(:new).with(
        shared_text: "Hello!",
        channels: anything,
        organization: organization
      ).and_return(service_instance)

      graphql_execute(
        mutation,
        current_user: user,
        variables: {
          input: {
            sharedText: "Hello!",
            channelIds: [channel.id]
          }
        }
      )

      expect(Mcp::GenerateVariantsService).to have_received(:new).with(
        shared_text: "Hello!",
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
        Mcp::GenerateVariantsService::PostVariant.new(channel_id: own_channel.id, body: "Generated text")
      ])
      allow(Mcp::GenerateVariantsService).to receive(:new).and_return(service_instance)

      graphql_execute(
        mutation,
        current_user: user,
        variables: {
          input: {
            sharedText: "Hello!",
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
