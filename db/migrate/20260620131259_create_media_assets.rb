class CreateMediaAssets < ActiveRecord::Migration[8.1]
  def change
    create_table :media_assets, id: :string do |t|
      t.references :organization, null: false, type: :string, foreign_key: true

      t.timestamps
    end
  end
end
