class CreateProgrammes < ActiveRecord::Migration[7.0]
  def change
    create_table :programmes do |t|
      t.references :ministere, null: false, foreign_key: true
      t.integer :numero
      t.string :nom

      t.timestamps
    end
  end
end
