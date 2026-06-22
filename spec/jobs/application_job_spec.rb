require "rails_helper"

RSpec.describe ApplicationJob do
  it "uses the default queue" do
    expect(described_class.queue_name).to eq("default")
  end

  it "can be enqueued and processed in the default queue" do
    ActiveJob::Base.queue_adapter = :test

    job_class = Class.new(ApplicationJob) do
      def perform
      end
    end

    expect { job_class.perform_later }.to have_enqueued_job(job_class).on_queue("default")
  end
end
