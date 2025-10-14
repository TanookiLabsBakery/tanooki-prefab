class ConvertEmailToCitext < ActiveRecord::Migration[8.0]
  def up
    enable_extension "citext"
    execute "ALTER TABLE users ALTER COLUMN email TYPE citext"
  end

  def down
    execute "ALTER TABLE users ALTER COLUMN email TYPE varchar"
  end
end
