require "rails_helper"

RSpec.describe Mutations::MediaAssets::MediaAssetCreate, type: :request do
  let(:mutation) do
    <<-GRAPHQL
      mutation MediaAssetCreate($input: MediaAssetCreateInput!) {
        mediaAssetCreate(input: $input) {
          mediaAsset {
            id
            filename
            contentType
          }
        }
      }
    GRAPHQL
  end

  def create_signed_id(filename: "photo.jpg", content_type: "image/jpeg")
    blob = ActiveStorage::Blob.create_and_upload!(
      io: StringIO.new("fake image data"),
      filename: filename,
      content_type: content_type
    )
    blob.signed_id
  end

  context "as a user with an organization" do
    it "creates a media asset" do
      organization = create(:organization)
      user = create(:user, organization: organization)
      signed_id = create_signed_id

      result = graphql_execute(
        mutation,
        current_user: user,
        variables: {input: {signedId: signed_id}}
      )

      expect(result.dig("data", "mediaAssetCreate", "mediaAsset", "filename")).to eq("photo.jpg")
      expect(result.dig("data", "mediaAssetCreate", "mediaAsset", "contentType")).to eq("image/jpeg")

      asset = MediaAsset.last
      expect(asset.organization).to eq(organization)
      expect(asset.file).to be_attached
    end
  end

  context "as a user without an organization" do
    it "returns an error" do
      user = create(:user, organization: nil)
      signed_id = create_signed_id

      result = graphql_execute(
        mutation,
        current_user: user,
        variables: {input: {signedId: signed_id}},
        allow_errors: true
      )

      expect(result["errors"]).to be_present
    end
  end

  context "as a guest" do
    it "returns an error" do
      result = graphql_execute(
        mutation,
        current_user: nil,
        variables: {input: {signedId: "fake"}},
        allow_errors: true
      )

      expect(result["errors"]).to be_present
    end
  end
end
