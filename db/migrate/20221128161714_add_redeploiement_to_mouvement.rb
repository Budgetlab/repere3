class AddRedeploiementToMouvement < ActiveRecord::Migration[7.0]
  def change
    add_reference :mouvements, :redeploiement, foreign_key: true
  end
end
