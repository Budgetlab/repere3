class Programme < ApplicationRecord
  belongs_to :ministere
  has_many :services
  has_many :couts
  has_many :objectifs
  has_many :mouvements

  require 'roo'
  require 'axlsx'
  require 'csv'


  #def self.to_csv(region)
  #  header = %W{ Programme Effectifs\ cibles Plafond\ ETPT Plafond\ 3%\ ETP ETP\ supprimés %ETP\ supprimés ETP\ ajoutés ETPT\ supprimés ETPT\ ajoutés Mouvements\ en\ gestion\ (LFR) Mouvements\ en\ base\ (PLF\ N+1) }
  #  #attributes = %w{ region_id date quotite grade type_mouvement}
  #   
  #  CSV.generate(headers: true) do |csv|
  #    csv << header
#
  #    all.each do |programme|
  #      #csv << attributes.map {|attr| mouvement.send(attr)}
  #      csv << [programme.numero,programme.objectifs.where(region: region).sum('etp_cible').round(1), programme.objectifs.where(region: region).sum('etpt_plafond').round(2), (0.03*programme.objectifs.where(region: region).sum('etp_cible')).round(2), programme.mouvements.where(type_mouvement: "suppression", region: region).sum('quotite').round(1), 
  #        ((programme.mouvements.where(type_mouvement: "suppression", region: region).sum('quotite')/programme.objectifs.where(region: region).sum('etp_cible'))*100).round(2),programme.mouvements.where(type_mouvement: "ajout", region: region).sum('quotite').round(1), 
  #        programme.mouvements.where(type_mouvement: "suppression", region: region).sum('etpt').round(2),programme.mouvements.where(type_mouvement: "ajout", region: region).sum('etpt').round(2), programme.mouvements.where(region: region).sum('credits_gestion').to_i,programme.mouvements.where(region: region).sum('cout_etp').to_i]
  #    end
  #  end 
  #end 

    def self.import(file)
      Ministere.destroy_all
      Programme.destroy_all

      data = Roo::Spreadsheet.open(file.path)
      headers = data.row(1) # get header row
      data.each_with_index do |row, idx|
        next if idx == 0 # skip header
        row_data = Hash[[headers, row].transpose]
        Ministere.where('nom = ?',row_data['Ministere'].to_s).first_or_create do |ministere|
          ministere.nom = row_data['Ministere'].to_s
        end
        Programme.where('numero = ?',row_data['Numero'].to_i).first_or_create do |programme|
          programme.numero = row_data['Numero'].to_i
          programme.nom = row_data['Nom programme']
          programme.ministere_id = Ministere.where('nom = ?',row_data['Ministere']).first.id        
        end
      end
    end

  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "id", "id_value", "ministere_id", "nom", "numero", "updated_at"]
  end
  def self.ransackable_associations(auth_object = nil)
    ["couts", "ministere", "mouvements", "objectifs", "services"]
  end
end
