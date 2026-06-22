require "rails_helper"

RSpec.describe Analytics::PollPostEngagementJob, type: :job do
  describe "queue" do
    it "uses the analytics queue" do
      expect(described_class.queue_name).to eq("analytics")
    end
  end

  describe "#perform" do
    let(:organization) { create(:organization) }
    let(:credential) { create(:credential, organization:) }
    let(:channel) { create(:channel, organization:, credential:, provider: "bluesky") }

    let(:published_post) { create(:post, organization:, status: "published") }
    let(:draft_post) { create(:post, organization:, status: "draft") }

    let!(:published_variant) { create(:post_channel_variant, post: published_post, channel:) }
    let!(:draft_variant) { create(:post_channel_variant, post: draft_post, channel:) }

    before do
      allow_any_instance_of(Analytics::EngagementFetcher).to receive(:fetch).and_return(
        impressions: 200,
        likes: 15,
        comments: 3,
        shares: 2,
        reposts: 8
      )
    end

    it "creates a PostAnalytic for published post variants" do
      expect { described_class.new.perform }.to change(PostAnalytic, :count).by(1)
    end

    it "saves the fetched stats to the post_analytic record" do
      described_class.new.perform
      analytic = published_variant.reload.post_analytic

      expect(analytic).to be_present
      expect(analytic.likes).to eq(15)
      expect(analytic.comments).to eq(3)
      expect(analytic.reposts).to eq(8)
      expect(analytic.fetched_at).to be_within(5.seconds).of(Time.current)
    end

    it "does not create analytics for draft post variants" do
      described_class.new.perform
      expect(draft_variant.reload.post_analytic).to be_nil
    end

    it "updates existing analytics on subsequent runs" do
      create(:post_analytic, post_channel_variant: published_variant, likes: 0)

      described_class.new.perform

      expect(published_variant.reload.post_analytic.likes).to eq(15)
      expect(PostAnalytic.count).to eq(1)
    end

    it "can be enqueued" do
      ActiveJob::Base.queue_adapter = :test
      expect { described_class.perform_later }.to have_enqueued_job(described_class).on_queue("analytics")
    end
  end
end
