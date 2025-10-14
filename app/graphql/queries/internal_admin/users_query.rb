module Queries
  class InternalAdmin::UsersQuery < BaseQuery
    type Types::Objects::UserType.connection_type, null: false

    def resolve
      authorized_scope(User.all.order(:first_name, :last_name, :email))
    end
  end
end
