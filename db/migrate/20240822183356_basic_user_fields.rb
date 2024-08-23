class BasicUserFields < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :discarded_at, :datetime
    add_column :users, :current_organization_id, :string, null: false

    # User roles
    create_enum :user_role, %w[system_admin default], default: "default"
    add_column :users, :user_role, :enum, enum_type: "user_role", null: false, default: "default"

    # User status
    create_enum :user_status, %w[invited active blocked], default: "active"
    add_column :users, :user_status, :enum, enum_type: "user_status", null: false, default: "active"
  end
end
