class RemoveOrganizations < ActiveRecord::Migration[8.0]
  def change
    remove_column :users, :current_organization_id, :string

    drop_table :memberships do |t|
      t.references :user, null: false, foreign_key: true, type: :string
      t.references :organization, null: false, foreign_key: true, type: :string
      t.column :membership_role, :membership_role, null: false, default: "default"
      t.datetime :discarded_at
      t.timestamps
      t.index [:user_id, :organization_id], unique: true
    end

    drop_table :organizations do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.string :time_zone, null: false
      t.column :organization_type, :organization_type, null: false, default: "standard"
      t.datetime :discarded_at
      t.timestamps
      t.index :organization_type, unique: true, where: "organization_type = 'system'"
    end

    execute "DROP TYPE IF EXISTS membership_role"
    execute "DROP TYPE IF EXISTS organization_type"
  end
end
