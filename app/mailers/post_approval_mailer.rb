class PostApprovalMailer < ApplicationMailer
  def request_approval_email
    @post = params[:post]
    @approver = params[:approver]
    @signed_id = @post.signed_id(expires_in: 7.days)
    @approval_url = "#{root_url}posts/#{@signed_id}/approve"

    mail(
      to: "#{@approver.full_name} <#{@approver.email}>",
      subject: "Post Approval Required — #{AppConfig.app_name}"
    ) do |format|
      format.html { render layout: false }
      format.text
    end
  end
end
