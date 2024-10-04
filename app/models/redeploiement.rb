class Redeploiement < ApplicationRecord
  belongs_to :region
  has_many :mouvements, dependent: :destroy

  def self.ransackable_associations(auth_object = nil)
    ["mouvements", "region"]
  end
  def self.ransackable_attributes(auth_object = nil)
    ["ajout", "cout_etp", "created_at", "credits_gestion", "id", "id_value", "region_id", "suppression", "updated_at"]
  end
end
