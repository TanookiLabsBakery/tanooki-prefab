require "rails_helper"

RSpec.describe Mutations::Channels::ChannelDelete, type: :request do
  let(:mutation) do
    <<-GRAPHQL
      mutation ChannelDelete($input: ChannelDeleteInput!) {
        channelDelete(input: $input) {
          success
        }
      }
    GRAPHQL
  end

  context "as a user in the same organization as the channel" do
    it "deletes the channel" do
      organization = create(:organization)
      user = create(:user, organization: organization)
      channel = create(:channel, organization: organization)

      result = graphql_execute(
        mutation,
        current_user: user,
        variables: {
          input: {id: channel.id}
        }
      )

      expect(result.dig("data", "channelDelete", "success")).to be(true)
      expect(Channel.find_by(id: channel.id)).to be_nil
    end
  end

  context "as a user trying to delete a channel from another organization" do
    it "returns an authorization error" do
      organization = create(:organization)
      other_organization = create(:organization)
      user = create(:user, organization: organization)
      channel = create(:channel, organization: other_organization)

      result = graphql_execute(
        mutation,
        current_user: user,
        variables: {
          input: {id: channel.id}
        },
        allow_errors: true
      )

      expect(result["errors"]).to be_present
      expect(Channel.find_by(id: channel.id)).to be_present
    end
  end

  context "as a user without an organization" do
    it "returns an authorization error" do
      other_organization = create(:organization)
      user = create(:user, organization: nil)
      channel = create(:channel, organization: other_organization)

      result = graphql_execute(
        mutation,
        current_user: user,
        variables: {
          input: {id: channel.id}
        },
        allow_errors: true
      )

      expect(result["errors"]).to be_present
      expect(Channel.find_by(id: channel.id)).to be_present
    end
  end
end
