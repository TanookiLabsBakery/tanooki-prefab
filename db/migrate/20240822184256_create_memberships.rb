class CreateMemberships < ActiveRecord::Migration[7.2]
  def change
    create_enum :membership_role, %w[organization_admin default], default: "default"

    create_table :memberships, id: :string do |t|
      t.references :user, null: false, foreign_key: true, type: :string
      t.references :organization, null: false, foreign_key: true, type: :string
      t.column :membership_role, :membership_role, null: false, default: "default"

      t.datetime :discarded_at
      t.timestamps
    end

    add_index :memberships, [:user_id, :organization_id], unique: true
  end
end
