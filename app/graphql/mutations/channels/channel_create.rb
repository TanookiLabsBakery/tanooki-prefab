# frozen_string_literal: true

module Mutations
  module Channels
    class ChannelCreate < BaseMutation
      description "Creates a channel from an existing OAuth credential"

      argument :credential_id, ID, required: true
      argument :name, String, required: true
      argument :remote_id, String, required: true

      field :channel, Types::Objects::ChannelType, null: true

      def resolve(credential_id:, name:, remote_id:)
        organization = context[:current_user]&.organization
        raise GraphQL::ExecutionError, "You must belong to an organization to create channels" unless organization

        credential = ::Credential.find_by(id: credential_id, organization_id: organization.id)
        raise GraphQL::ExecutionError, "Credential not found" unless credential

        channel = ::Channel.new(
          credential: credential,
          organization: organization,
          provider: credential.provider,
          name: name,
          remote_id: remote_id
        )

        authorize! channel, to: :create?

        unless channel.save
          raise ValidationError.new "Error creating channel", record: channel
        end

        {channel: channel}
      end
    end
  end
end
