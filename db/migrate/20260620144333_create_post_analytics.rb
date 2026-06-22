class CreatePostAnalytics < ActiveRecord::Migration[8.1]
  def change
    create_table :post_analytics, id: :string do |t|
      t.references :post_channel_variant, null: false, type: :string, foreign_key: true, index: {unique: true}
      t.integer :impressions, null: false, default: 0
      t.integer :likes, null: false, default: 0
      t.integer :comments, null: false, default: 0
      t.integer :shares, null: false, default: 0
      t.integer :reposts, null: false, default: 0
      t.datetime :fetched_at

      t.timestamps
    end
  end
end
