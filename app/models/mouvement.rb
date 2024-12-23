class Mouvement < ApplicationRecord
  belongs_to :user
  belongs_to :region
  belongs_to :service
  belongs_to :programme
  belongs_to :redeploiement

  scope :suppressions, -> { where(type_mouvement: "suppression") }

  require 'roo'
  def self.import(file)
  end

  def self.ransackable_attributes(auth_object = nil)
    ["cout_etp", "created_at", "credits_gestion", "date", "date_effet", "etpt", "grade", "id", "id_value", "mouvement_lien", "ponctuel", "programme_id", "quotite", "redeploiement_id", "region_id", "service_id", "type_mouvement", "updated_at", "user_id"]
  end
  def self.ransackable_associations(auth_object = nil)
    ["programme", "redeploiement", "region", "service", "user"]
  end

end
