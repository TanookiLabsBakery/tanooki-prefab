class CreatePostChannelVariants < ActiveRecord::Migration[8.1]
  def change
    create_table :post_channel_variants, id: :string do |t|
      t.references :post, null: false, type: :string, foreign_key: true
      t.references :channel, null: false, type: :string, foreign_key: true
      t.text :body

      t.timestamps
    end
  end
end
