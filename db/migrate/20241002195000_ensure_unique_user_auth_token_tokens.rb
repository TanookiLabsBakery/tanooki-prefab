class EnsureUniqueUserAuthTokenTokens < ActiveRecord::Migration[7.2]
  def change
    remove_index :user_auth_tokens, :token
    add_index :user_auth_tokens, :token, unique: true
  end
end
