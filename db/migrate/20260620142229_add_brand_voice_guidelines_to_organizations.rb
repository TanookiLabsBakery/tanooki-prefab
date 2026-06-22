class AddBrandVoiceGuidelinesToOrganizations < ActiveRecord::Migration[8.1]
  def change
    add_column :organizations, :brand_voice_guidelines, :text
  end
end
