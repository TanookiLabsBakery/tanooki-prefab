class CreateUserAuthTokens < ActiveRecord::Migration[7.2]
  def change
    create_table :user_auth_tokens, id: :string do |t|
      t.references :user, null: false, foreign_key: {on_delete: :cascade}, type: :string, index: true
      t.string :token, null: false
      t.timestamps
    end

    add_index :user_auth_tokens, :token
  end
end
