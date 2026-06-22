class CreatePosts < ActiveRecord::Migration[8.1]
  def change
    create_enum :post_status, %w[draft scheduled published error needs_approval]

    create_table :posts, id: :string do |t|
      t.references :organization, null: false, type: :string, foreign_key: true
      t.enum :status, enum_type: "post_status", null: false, default: "draft"

      t.timestamps
    end
  end
end
