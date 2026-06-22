class ChangeCredentialsExpiresAtToText < ActiveRecord::Migration[8.1]
  def change
    change_column :credentials, :expires_at, :text
  end
end
