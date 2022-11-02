class CreateCouts < ActiveRecord::Migration[7.0]
  def change
    create_table :couts do |t|
      t.string :categorie
      t.float :cout
      t.references :programme, null: false, foreign_key: true

      t.timestamps
    end
  end
end
