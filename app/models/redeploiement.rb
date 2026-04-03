class Redeploiement < ApplicationRecord
  belongs_to :region

  def to_s
    "#{region&.nom} — ajout: #{ajout}, suppression: #{suppression}"
  end

  def recalculer_totaux
    mvts = mouvements.reload
    update!(
      suppression: mvts.count { |m| m.type_mouvement == 'suppression' },
      ajout: mvts.count { |m| m.type_mouvement == 'ajout' },
      cout_etp: mvts.sum { |m| m.cout_etp.to_i },
      credits_gestion: mvts.sum { |m| m.credits_gestion.to_i }
    )
  end
  has_many :mouvements, dependent: :destroy

  def self.ransackable_associations(auth_object = nil)
    ["mouvements", "region"]
  end
  def self.ransackable_attributes(auth_object = nil)
    ["ajout", "cout_etp", "created_at", "credits_gestion", "id", "id_value", "region_id", "suppression", "updated_at"]
  end
end
