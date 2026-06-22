# frozen_string_literal: true

require "sidekiq/api"

module Mutations
  module Posts
    class PostReschedule < BaseMutation
      description "Reschedules a post to a new time, updating the associated Sidekiq job"

      field :post, Types::Objects::PostType, null: false

      argument :post_id, ID, required: true
      argument :scheduled_at, GraphQL::Types::ISO8601DateTime, required: true

      def resolve(post_id:, scheduled_at:)
        post = ::Post.find(post_id)
        authorize! post, to: :reschedule?

        if post.sidekiq_job_id.present?
          Sidekiq::ScheduledSet.new.find { |job| job.jid == post.sidekiq_job_id }&.delete
        end

        post.update!(scheduled_at: scheduled_at)

        job = ::Posts::PublishPostJob.set(wait_until: scheduled_at).perform_later(post.id)
        post.update!(sidekiq_job_id: job.provider_job_id)

        {post: post}
      end
    end
  end
end
