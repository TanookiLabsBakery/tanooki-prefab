class ApprovalsController < ActionController::Base
  protect_from_forgery with: :null_session

  before_action :find_post_from_token

  def show
  end

  def approve
    @post.update!(status: :draft)
    @action = :approved
    render :confirmation
  end

  def reject
    @post.update!(status: :draft)
    @action = :rejected
    render :confirmation
  end

  private

  def find_post_from_token
    @post = Post.find_signed!(params[:token])
  rescue ActiveSupport::MessageVerifier::InvalidSignature, ActiveRecord::RecordNotFound
    render :invalid_token, status: :not_found
  end
end
