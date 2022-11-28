class CreateRedeploiements < ActiveRecord::Migration[7.0]
  def change
    create_table :redeploiements do |t|
      t.references :region, null: false, foreign_key: true
      t.integer :ajout
      t.integer :suppression
      t.float :cout_etp
      t.float :credits_gestion

      t.timestamps
    end
  end
end
