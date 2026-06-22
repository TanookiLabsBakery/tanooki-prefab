require "rails_helper"

RSpec.describe Mutations::Posts::PostCreate, type: :request do
  let(:mutation) do
    <<-GRAPHQL
      mutation PostCreate($input: PostCreateInput!) {
        postCreate(input: $input) {
          post {
            id
            status
          }
        }
      }
    GRAPHQL
  end

  context "as a user with an organization" do
    it "creates a post with channel variants" do
      organization = create(:organization)
      user = create(:user, organization: organization)
      channel = create(:channel, organization: organization)

      result = graphql_execute(
        mutation,
        current_user: user,
        variables: {
          input: {
            postInput: {
              channelVariants: [
                {channelId: channel.id, body: "Hello world!"}
              ]
            }
          }
        }
      )

      expect(result.dig("data", "postCreate", "post", "status")).to eq("DRAFT")
      post = Post.last
      expect(post.organization).to eq(organization)
      expect(post.post_channel_variants.count).to eq(1)
      expect(post.post_channel_variants.first.body).to eq("Hello world!")
      expect(post.post_channel_variants.first.channel).to eq(channel)
    end

    it "creates a post with multiple channel variants" do
      organization = create(:organization)
      user = create(:user, organization: organization)
      channel_1 = create(:channel, organization: organization)
      channel_2 = create(:channel, organization: organization)

      result = graphql_execute(
        mutation,
        current_user: user,
        variables: {
          input: {
            postInput: {
              channelVariants: [
                {channelId: channel_1.id, body: "Content for channel 1"},
                {channelId: channel_2.id, body: "Content for channel 2"}
              ]
            }
          }
        }
      )

      expect(result.dig("data", "postCreate", "post", "status")).to eq("DRAFT")
      post = Post.last
      expect(post.post_channel_variants.count).to eq(2)
    end
  end

  context "as a user trying to use a channel from another organization" do
    it "returns an error" do
      organization = create(:organization)
      other_organization = create(:organization)
      user = create(:user, organization: organization)
      channel = create(:channel, organization: other_organization)

      result = graphql_execute(
        mutation,
        current_user: user,
        variables: {
          input: {
            postInput: {
              channelVariants: [
                {channelId: channel.id, body: "Hello world!"}
              ]
            }
          }
        },
        allow_errors: true
      )

      expect(result["errors"]).to be_present
    end
  end

  context "as a user without an organization" do
    it "returns an error" do
      user = create(:user, organization: nil)
      organization = create(:organization)
      channel = create(:channel, organization: organization)

      result = graphql_execute(
        mutation,
        current_user: user,
        variables: {
          input: {
            postInput: {
              channelVariants: [
                {channelId: channel.id, body: "Hello world!"}
              ]
            }
          }
        },
        allow_errors: true
      )

      expect(result["errors"]).to be_present
    end
  end
end
