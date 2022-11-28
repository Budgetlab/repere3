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

ActiveRecord::Schema[7.0].define(version: 2022_11_28_161714) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "couts", force: :cascade do |t|
    t.string "categorie"
    t.float "cout"
    t.bigint "programme_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["programme_id"], name: "index_couts_on_programme_id"
  end

  create_table "ministeres", force: :cascade do |t|
    t.string "nom"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "mouvements", force: :cascade do |t|
    t.date "date"
    t.bigint "user_id", null: false
    t.bigint "region_id", null: false
    t.float "quotite"
    t.string "grade"
    t.date "date_effet"
    t.string "type_mouvement"
    t.bigint "service_id", null: false
    t.bigint "programme_id", null: false
    t.float "cout_etp"
    t.boolean "ponctuel"
    t.integer "mouvement_lien"
    t.float "credits_gestion"
    t.float "etpt"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "redeploiement_id"
    t.index ["programme_id"], name: "index_mouvements_on_programme_id"
    t.index ["redeploiement_id"], name: "index_mouvements_on_redeploiement_id"
    t.index ["region_id"], name: "index_mouvements_on_region_id"
    t.index ["service_id"], name: "index_mouvements_on_service_id"
    t.index ["user_id"], name: "index_mouvements_on_user_id"
  end

  create_table "objectifs", force: :cascade do |t|
    t.date "date"
    t.float "etp_cible"
    t.float "etpt_plafond"
    t.bigint "region_id", null: false
    t.bigint "programme_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["programme_id"], name: "index_objectifs_on_programme_id"
    t.index ["region_id"], name: "index_objectifs_on_region_id"
  end

  create_table "programmes", force: :cascade do |t|
    t.bigint "ministere_id", null: false
    t.integer "numero"
    t.string "nom"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["ministere_id"], name: "index_programmes_on_ministere_id"
  end

  create_table "redeploiements", force: :cascade do |t|
    t.bigint "region_id", null: false
    t.integer "ajout"
    t.integer "suppression"
    t.float "cout_etp"
    t.float "credits_gestion"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["region_id"], name: "index_redeploiements_on_region_id"
  end

  create_table "regions", force: :cascade do |t|
    t.string "nom"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "services", force: :cascade do |t|
    t.string "nom"
    t.bigint "programme_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["programme_id"], name: "index_services_on_programme_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "statut"
    t.string "nom"
    t.bigint "region_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["region_id"], name: "index_users_on_region_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "couts", "programmes"
  add_foreign_key "mouvements", "programmes"
  add_foreign_key "mouvements", "redeploiements"
  add_foreign_key "mouvements", "regions"
  add_foreign_key "mouvements", "services"
  add_foreign_key "mouvements", "users"
  add_foreign_key "objectifs", "programmes"
  add_foreign_key "objectifs", "regions"
  add_foreign_key "programmes", "ministeres"
  add_foreign_key "redeploiements", "regions"
  add_foreign_key "services", "programmes"
  add_foreign_key "users", "regions"
end
