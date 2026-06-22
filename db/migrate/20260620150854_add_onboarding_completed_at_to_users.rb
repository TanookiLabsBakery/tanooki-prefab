class AddOnboardingCompletedAtToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :onboarding_completed_at, :datetime

    reversible do |dir|
      dir.up do
        execute "UPDATE users SET onboarding_completed_at = created_at"
      end
    end
  end
end
