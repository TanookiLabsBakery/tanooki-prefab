class UserConstraint
  def initialize(&block)
    @block = block
  end

  def matches?(request)
    user = current_user(request)
    @block.call(user)
  end

  def current_user(request)
    User.find_by(id: request.session["user_id"])
  end
end
