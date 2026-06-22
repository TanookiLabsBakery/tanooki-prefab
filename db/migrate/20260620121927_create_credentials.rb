class CreateCredentials < ActiveRecord::Migration[8.1]
  def change
    create_table :credentials, id: :string do |t|
      t.references :organization, null: false, foreign_key: true, type: :string
      t.string :provider, null: false
      t.text :access_token
      t.text :refresh_token
      t.datetime :expires_at

      t.timestamps
    end
  end
end
