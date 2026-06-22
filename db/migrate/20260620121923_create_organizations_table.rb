class CreateOrganizationsTable < ActiveRecord::Migration[8.1]
  def change
    create_table :organizations, id: :string do |t|
      t.string :name, null: false

      t.timestamps
    end
  end
end
