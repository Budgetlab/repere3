class Mouvement < ApplicationRecord
  belongs_to :user
  belongs_to :region
  belongs_to :service
  belongs_to :programme
  belongs_to :redeploiement

  scope :suppressions, -> { where(type_mouvement: "suppression") }

  before_update :recalculer_couts
  after_update :sync_redeploiement

  private

  def recalculer_couts
    cout_unitaire  = Cout.find_by(programme_id: programme_id, categorie: grade)&.cout.to_f
    annee          = date_effet.year
    fin_annee      = Date.new(annee, 12, 31)
    debut_annee    = Date.new(annee, 1, 1)
    jours_restants = (fin_annee + 1 - date_effet).to_i

    if type_mouvement == 'suppression'
      self.cout_etp        = ponctuel? ? 0 : -(quotite.to_f * cout_unitaire).round
      self.credits_gestion = -(quotite.to_f * cout_unitaire * jours_restants / 365).round
      self.etpt            = (quotite.to_f * (date_effet - debut_annee).to_i / 365).round(2)
    else
      self.cout_etp        = ponctuel? ? 0 : (quotite.to_f * cout_unitaire).round
      self.credits_gestion = (quotite.to_f * cout_unitaire * jours_restants / 365).round
      self.etpt            = (quotite.to_f * jours_restants / 365).round
    end
  end

  def sync_redeploiement
    redeploiement&.recalculer_totaux
  end

  def self.ransackable_attributes(auth_object = nil)
    ["cout_etp", "created_at", "credits_gestion", "date", "date_effet", "etpt", "grade", "id", "id_value", "mouvement_lien", "ponctuel", "programme_id", "quotite", "redeploiement_id", "region_id", "service_id", "type_mouvement", "updated_at", "user_id"]
  end
  def self.ransackable_associations(auth_object = nil)
    ["programme", "redeploiement", "region", "service", "user"]
  end

end
