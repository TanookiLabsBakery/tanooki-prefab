# this determines access to the 'internal_admin' part of the site
class InternalAdminPolicy < GuestPolicy
  def view?
    user&.user_role_system_admin?
  end
end
