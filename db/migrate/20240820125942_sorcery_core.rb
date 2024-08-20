class SorceryCore < ActiveRecord::Migration[7.2]
  def change
    create_table(:users, id: :string) do |t|
      t.string(:email, null: false, index: {unique: true})
      t.string(:first_name, null: false)
      t.string(:last_name, null: false)
      t.string(:time_zone, null: false)
      t.string(:crypted_password)
      t.string(:salt)

      t.timestamps(null: false)
    end
  end
end
