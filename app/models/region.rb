class Region < ApplicationRecord
	has_many :objectifs
  	has_many :mouvements

  	require 'roo'
  	require 'axlsx'
  	require 'csv'

  	#def self.to_csv(programme)
    #header = %W{ Region Effectifs\ cibles Plafond\ ETPT Plafond\ 3%\ ETP ETP\ supprimés %ETP\ supprimés ETP\ ajoutés ETPT\ supprimés ETPT\ ajoutés Mouvements\ en\ gestion\ (LFR) Mouvements\ en\ base\ (PLF\ N+1) }
    ##attributes = %w{ region_id date quotite grade type_mouvement}
    # 
    #CSV.generate(headers: true) do |csv|
    #  csv << header
#
    #  all.each do |region|
    #    #csv << attributes.map {|attr| mouvement.send(attr)}
    #    csv << [region.nom,region.objectifs.where(programme_id: programme).sum('etp_cible').round(1), region.objectifs.where(programme_id: programme).sum('etpt_plafond').round(2), (0.03*region.objectifs.where(programme_id: programme).sum('etp_cible')).round(2), region.mouvements.where(type_mouvement: "suppression", programme_id: programme).sum('quotite').round(1), 
    #      ((region.mouvements.where(type_mouvement: "suppression", programme_id: programme).sum('quotite')/region.objectifs.where(programme_id: programme).sum('etp_cible'))*100).round(2),region.mouvements.where(type_mouvement: "ajout",programme_id: programme).sum('quotite').round(1), 
    #      region.mouvements.where(type_mouvement: "suppression", programme_id: programme).sum('etpt').round(2),region.mouvements.where(type_mouvement: "ajout", programme_id: programme).sum('etpt').round(2), region.mouvements.where(programme_id: programme).sum('credits_gestion').to_i,region.mouvements.where(programme_id: programme).sum('cout_etp').to_i]
    #  end
    #end 
  	#end 
end
