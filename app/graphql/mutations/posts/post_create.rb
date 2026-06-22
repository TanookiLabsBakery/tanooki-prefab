# frozen_string_literal: true

module Mutations
  module Posts
    class PostCreate < BaseMutation
      description "Creates a new post with channel variants"

      field :post, Types::Objects::PostType, null: false

      argument :post_input, Types::Inputs::PostInputType, required: true

      def resolve(post_input:)
        organization = context[:current_user]&.organization
        raise GraphQL::ExecutionError, "You must belong to an organization to create posts" unless organization

        channel_ids = post_input.channel_variants.map(&:channel_id)
        channels = ::Channel.where(organization_id: organization.id, id: channel_ids)

        if channels.length != channel_ids.length
          raise GraphQL::ExecutionError, "One or more channels not found in your organization"
        end

        post = Post.new(organization: organization, scheduled_at: post_input.scheduled_at)

        post_input.channel_variants.each do |variant_input|
          channel = channels.find { |c| c.id == variant_input.channel_id }
          post.post_channel_variants.build(channel: channel, body: variant_input.body)
        end

        authorize! post, to: :create?

        unless post.save
          raise ValidationError.new "Error creating post", record: post
        end

        {post: post}
      end
    end
  end
end
