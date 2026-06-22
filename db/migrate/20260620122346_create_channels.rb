class CreateChannels < ActiveRecord::Migration[8.1]
  def change
    create_enum :channel_provider, %w[bluesky mastodon threads]

    create_table :channels, id: :string do |t|
      t.string :name, null: false
      t.enum :provider, enum_type: "channel_provider", null: false
      t.string :remote_id, null: false
      t.references :organization, null: false, type: :string, foreign_key: true
      t.references :credential, null: false, type: :string, foreign_key: true

      t.timestamps
    end
  end
end
