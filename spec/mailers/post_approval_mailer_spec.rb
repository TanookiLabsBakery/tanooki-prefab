require "rails_helper"

RSpec.describe PostApprovalMailer, type: :mailer do
  describe "request_approval_email" do
    let(:post) { create(:post, status: "needs_approval") }
    let(:approver) { create(:user, first_name: "Jane", last_name: "Smith", user_role: "admin") }
    let(:mail) { PostApprovalMailer.with(post: post, approver: approver).request_approval_email.deliver_now }

    it "renders the headers" do
      expect(mail.subject).to eq("Post Approval Required — #{AppConfig.app_name}")
      expect(mail.to).to eq([approver.email])
      expect(mail.from).to eq([AppConfig.default_from_email[/<(.+)>/, 1]])
    end

    it "addresses the approver by first name" do
      expect(mail.body.encoded).to include(approver.first_name)
    end

    it "includes the app name" do
      expect(mail.body.encoded).to include(AppConfig.app_name)
    end

    it "includes a signed link to the approval page" do
      expect(mail.body.encoded).to include("/posts/")
      expect(mail.body.encoded).to include("/approve")
    end

    it "builds a deliverable message" do
      message = PostApprovalMailer.with(post: post, approver: approver).request_approval_email
      expect(message).to be_a(ActionMailer::MessageDelivery)
    end
  end
end
