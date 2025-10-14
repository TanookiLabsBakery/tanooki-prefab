# https://actionpolicy.evilmartians.io/#/authorization_context?id=authorization-context
class GuestPolicy < ApplicationPolicy
  authorize :user, allow_nil: true
end
