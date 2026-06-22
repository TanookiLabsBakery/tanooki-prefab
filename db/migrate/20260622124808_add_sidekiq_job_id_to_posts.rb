class AddSidekiqJobIdToPosts < ActiveRecord::Migration[8.1]
  def change
    add_column :posts, :sidekiq_job_id, :string
    add_index :posts, :sidekiq_job_id
  end
end
