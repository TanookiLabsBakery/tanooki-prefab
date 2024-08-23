# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2024_08_22_184256) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  # Custom types defined in this database.
  # Note that some types may not work with other database engines. Be careful if changing database.
  create_enum "membership_role", ["organization_admin", "default"]
  create_enum "organization_type", ["system", "standard", "personal"]
  create_enum "user_role", ["system_admin", "default"]
  create_enum "user_status", ["invited", "active", "blocked"]

  create_table "memberships", id: :string, force: :cascade do |t|
    t.string "user_id", null: false
    t.string "organization_id", null: false
    t.enum "membership_role", default: "default", null: false, enum_type: "membership_role"
    t.datetime "discarded_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_memberships_on_organization_id"
    t.index ["user_id", "organization_id"], name: "index_memberships_on_user_id_and_organization_id", unique: true
    t.index ["user_id"], name: "index_memberships_on_user_id"
  end

  create_table "organizations", id: :string, force: :cascade do |t|
    t.string "name", null: false
    t.string "slug", null: false
    t.string "time_zone", null: false
    t.enum "organization_type", default: "standard", null: false, enum_type: "organization_type"
    t.datetime "discarded_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_type"], name: "index_organizations_on_organization_type", unique: true, where: "(organization_type = 'system'::organization_type)"
  end

  create_table "user_auth_challenges", id: :string, force: :cascade do |t|
    t.string "token_digest", null: false
    t.string "user_id", null: false
    t.datetime "claimed_at"
    t.datetime "timeout_at", null: false
    t.uuid "client_auth_code", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_auth_challenges_on_user_id"
  end

  create_table "users", id: :string, force: :cascade do |t|
    t.string "email", null: false
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "time_zone", null: false
    t.string "crypted_password"
    t.string "salt"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "remember_me_token"
    t.datetime "remember_me_token_expires_at"
    t.string "reset_password_token"
    t.datetime "reset_password_token_expires_at"
    t.datetime "reset_password_email_sent_at"
    t.integer "access_count_to_reset_password_page", default: 0
    t.datetime "discarded_at"
    t.string "current_organization_id", null: false
    t.enum "user_role", default: "default", null: false, enum_type: "user_role"
    t.enum "user_status", default: "active", null: false, enum_type: "user_status"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["remember_me_token"], name: "index_users_on_remember_me_token"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token"
  end

  add_foreign_key "memberships", "organizations"
  add_foreign_key "memberships", "users"
  add_foreign_key "user_auth_challenges", "users"
end
