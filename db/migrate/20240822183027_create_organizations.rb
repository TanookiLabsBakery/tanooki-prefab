class CreateOrganizations < ActiveRecord::Migration[7.2]
  def change
    create_enum :organization_type, %w[system standard personal], default: "standard"

    create_table :organizations, id: :string do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.string :time_zone, null: false
      t.column :organization_type, :organization_type, null: false, default: "standard"

      t.datetime :discarded_at

      t.timestamps
    end

    # only 1 system organization allowed
    add_index :organizations, :organization_type, unique: true, where: "organization_type = 'system'"
  end
end
