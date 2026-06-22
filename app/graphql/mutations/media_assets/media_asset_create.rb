# frozen_string_literal: true

module Mutations
  module MediaAssets
    class MediaAssetCreate < BaseMutation
      description "Creates a new media asset from a direct-uploaded file"

      field :media_asset, Types::Objects::MediaAssetType, null: false

      argument :signed_id, ID, required: true

      def resolve(signed_id:)
        organization = context[:current_user]&.organization
        raise GraphQL::ExecutionError, "You must belong to an organization to upload media" unless organization

        media_asset = MediaAsset.new(organization: organization)

        authorize! media_asset, to: :create?

        media_asset.file.attach(signed_id)

        unless media_asset.save
          raise ValidationError.new "Error creating media asset", record: media_asset
        end

        {media_asset: media_asset}
      end
    end
  end
end
