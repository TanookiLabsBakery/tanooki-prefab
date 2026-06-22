class AddContributorEditorAdminToUserRole < ActiveRecord::Migration[8.1]
  def up
    add_enum_value :user_role, "contributor"
    add_enum_value :user_role, "editor"
    add_enum_value :user_role, "admin"
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
