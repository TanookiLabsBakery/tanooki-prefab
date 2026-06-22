class AddOrganizationToUsers < ActiveRecord::Migration[8.1]
  def change
    add_reference :users, :organization, null: true, foreign_key: true, type: :string
  end
end
