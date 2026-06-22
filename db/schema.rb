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

ActiveRecord::Schema[8.1].define(version: 2026_06_22_124808) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "citext"
  enable_extension "pg_catalog.plpgsql"
  enable_extension "pg_stat_statements"

  # Custom types defined in this database.
  # Note that some types may not work with other database engines. Be careful if changing database.
  create_enum "channel_provider", ["bluesky", "mastodon", "threads"]
  create_enum "post_status", ["draft", "scheduled", "published", "error", "needs_approval"]
  create_enum "user_role", ["system_admin", "default", "contributor", "editor", "admin"]
  create_enum "user_status", ["invited", "active", "blocked"]

  create_table "active_storage_attachments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.string "record_id", null: false
    t.string "record_type", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.string "key", null: false
    t.text "metadata"
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "ahoy_events", id: :string, force: :cascade do |t|
    t.string "name"
    t.jsonb "properties"
    t.datetime "time"
    t.string "user_id"
    t.string "visit_id"
    t.index ["name", "time"], name: "index_ahoy_events_on_name_and_time"
    t.index ["properties"], name: "index_ahoy_events_on_properties", opclass: :jsonb_path_ops, using: :gin
    t.index ["user_id"], name: "index_ahoy_events_on_user_id"
    t.index ["visit_id"], name: "index_ahoy_events_on_visit_id"
  end

  create_table "ahoy_visits", id: :string, force: :cascade do |t|
    t.string "app_version"
    t.string "browser"
    t.string "city"
    t.string "country"
    t.string "device_type"
    t.string "ip"
    t.text "landing_page"
    t.float "latitude"
    t.float "longitude"
    t.string "os"
    t.string "os_version"
    t.string "platform"
    t.text "referrer"
    t.string "referring_domain"
    t.string "region"
    t.datetime "started_at"
    t.text "user_agent"
    t.string "user_id"
    t.string "utm_campaign"
    t.string "utm_content"
    t.string "utm_medium"
    t.string "utm_source"
    t.string "utm_term"
    t.string "visit_token"
    t.string "visitor_token"
    t.index ["user_id"], name: "index_ahoy_visits_on_user_id"
    t.index ["visit_token"], name: "index_ahoy_visits_on_visit_token", unique: true
    t.index ["visitor_token", "started_at"], name: "index_ahoy_visits_on_visitor_token_and_started_at"
  end

  create_table "channels", id: :string, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "credential_id", null: false
    t.string "name", null: false
    t.string "organization_id", null: false
    t.enum "provider", null: false, enum_type: "channel_provider"
    t.string "remote_id", null: false
    t.datetime "updated_at", null: false
    t.index ["credential_id"], name: "index_channels_on_credential_id"
    t.index ["organization_id"], name: "index_channels_on_organization_id"
  end

  create_table "credentials", id: :string, force: :cascade do |t|
    t.text "access_token"
    t.datetime "created_at", null: false
    t.text "expires_at"
    t.string "organization_id", null: false
    t.string "provider", null: false
    t.text "refresh_token"
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_credentials_on_organization_id"
  end

  create_table "media_assets", id: :string, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "organization_id", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_media_assets_on_organization_id"
  end

  create_table "organizations", id: :string, force: :cascade do |t|
    t.text "brand_voice_guidelines"
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
  end

  create_table "post_analytics", id: :string, force: :cascade do |t|
    t.integer "comments", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "fetched_at"
    t.integer "impressions", default: 0, null: false
    t.integer "likes", default: 0, null: false
    t.string "post_channel_variant_id", null: false
    t.integer "reposts", default: 0, null: false
    t.integer "shares", default: 0, null: false
    t.datetime "updated_at", null: false
    t.index ["post_channel_variant_id"], name: "index_post_analytics_on_post_channel_variant_id", unique: true
  end

  create_table "post_channel_variants", id: :string, force: :cascade do |t|
    t.text "body"
    t.string "channel_id", null: false
    t.datetime "created_at", null: false
    t.string "post_id", null: false
    t.datetime "updated_at", null: false
    t.index ["channel_id"], name: "index_post_channel_variants_on_channel_id"
    t.index ["post_id"], name: "index_post_channel_variants_on_post_id"
  end

  create_table "posts", id: :string, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "organization_id", null: false
    t.datetime "scheduled_at"
    t.string "sidekiq_job_id"
    t.enum "status", default: "draft", null: false, enum_type: "post_status"
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_posts_on_organization_id"
    t.index ["sidekiq_job_id"], name: "index_posts_on_sidekiq_job_id"
  end

  create_table "user_auth_challenges", id: :string, force: :cascade do |t|
    t.datetime "claimed_at"
    t.uuid "client_auth_code", null: false
    t.datetime "created_at", null: false
    t.datetime "timeout_at", null: false
    t.string "token_digest", null: false
    t.datetime "updated_at", null: false
    t.string "user_id", null: false
    t.index ["user_id"], name: "index_user_auth_challenges_on_user_id"
  end

  create_table "user_auth_tokens", id: :string, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "token", null: false
    t.datetime "updated_at", null: false
    t.string "user_id", null: false
    t.index ["token"], name: "index_user_auth_tokens_on_token", unique: true
    t.index ["user_id"], name: "index_user_auth_tokens_on_user_id"
  end

  create_table "users", id: :string, force: :cascade do |t|
    t.integer "access_count_to_reset_password_page", default: 0
    t.datetime "created_at", null: false
    t.string "crypted_password"
    t.datetime "discarded_at"
    t.citext "email", null: false
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.datetime "onboarding_completed_at"
    t.string "organization_id"
    t.string "remember_me_token"
    t.datetime "remember_me_token_expires_at"
    t.datetime "reset_password_email_sent_at"
    t.string "reset_password_token"
    t.datetime "reset_password_token_expires_at"
    t.string "salt"
    t.string "time_zone", null: false
    t.datetime "updated_at", null: false
    t.enum "user_role", default: "default", null: false, enum_type: "user_role"
    t.enum "user_status", default: "active", null: false, enum_type: "user_status"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["organization_id"], name: "index_users_on_organization_id"
    t.index ["remember_me_token"], name: "index_users_on_remember_me_token"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "channels", "credentials"
  add_foreign_key "channels", "organizations"
  add_foreign_key "credentials", "organizations"
  add_foreign_key "media_assets", "organizations"
  add_foreign_key "post_analytics", "post_channel_variants"
  add_foreign_key "post_channel_variants", "channels"
  add_foreign_key "post_channel_variants", "posts"
  add_foreign_key "posts", "organizations"
  add_foreign_key "user_auth_challenges", "users"
  add_foreign_key "user_auth_tokens", "users", on_delete: :cascade
  add_foreign_key "users", "organizations"
end
