class AddFieldsToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :statut, :string
    add_column :users, :nom, :string
    add_reference :users, :region, foreign_key: true
  end
end
