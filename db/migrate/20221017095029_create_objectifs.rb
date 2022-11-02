class CreateObjectifs < ActiveRecord::Migration[7.0]
  def change
    create_table :objectifs do |t|
      t.date :date
      t.float :etp_cible
      t.float :etpt_plafond
      t.references :region, null: false, foreign_key: true
      t.references :programme, null: false, foreign_key: true

      t.timestamps
    end
  end
end
