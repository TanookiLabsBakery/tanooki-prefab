require "rails_helper"

RSpec.describe ApprovalsController, type: :request do
  before { host! "127.0.0.1" }

  let(:post_record) { create(:post, status: "needs_approval") }
  let(:valid_token) { post_record.signed_id(expires_in: 7.days) }
  let(:invalid_token) { "invalid.token.value" }
  let(:expired_token) { post_record.signed_id(expires_in: -1.second) }

  describe "GET /approve/:token" do
    context "with a valid token" do
      it "returns 200" do
        get show_approval_path(token: valid_token)
        expect(response).to have_http_status(:ok)
      end
    end

    context "with an invalid token" do
      it "returns 404" do
        get show_approval_path(token: invalid_token)
        expect(response).to have_http_status(:not_found)
      end
    end

    context "with an expired token" do
      it "returns 404" do
        get show_approval_path(token: expired_token)
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "POST /approve/:token/approve" do
    context "with a valid token" do
      it "returns 200" do
        post approve_with_token_path(token: valid_token)
        expect(response).to have_http_status(:ok)
      end
    end

    context "with an invalid token" do
      it "returns 404" do
        post approve_with_token_path(token: invalid_token)
        expect(response).to have_http_status(:not_found)
      end
    end

    context "with an expired token" do
      it "returns 404" do
        post approve_with_token_path(token: expired_token)
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "POST /approve/:token/reject" do
    context "with a valid token" do
      it "returns 200" do
        post reject_with_token_path(token: valid_token)
        expect(response).to have_http_status(:ok)
      end
    end

    context "with an invalid token" do
      it "returns 404" do
        post reject_with_token_path(token: invalid_token)
        expect(response).to have_http_status(:not_found)
      end
    end

    context "with an expired token" do
      it "returns 404" do
        post reject_with_token_path(token: expired_token)
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
