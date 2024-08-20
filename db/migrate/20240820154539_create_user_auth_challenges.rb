class CreateUserAuthChallenges < ActiveRecord::Migration[7.2]
  def change
    create_table :user_auth_challenges, id: :string do |t|
      t.string :token_digest, null: false
      t.references :user, null: false, foreign_key: true, type: :string
      t.datetime :claimed_at
      t.datetime :timeout_at, null: false
      t.uuid :client_auth_code, null: false

      t.timestamps
    end
  end
end
