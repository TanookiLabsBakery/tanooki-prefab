module Queries
  class ViewerQuery < BaseQuery
    type Types::Objects::UserType, null: true

    def resolve
      current_user
    end
  end
end
