class Mouvement < ApplicationRecord
  belongs_to :user
  belongs_to :region
  belongs_to :service
  belongs_to :programme
  belongs_to :redeploiement

  require 'roo'
  require 'axlsx'
  require 'csv'

  def self.to_csv
    header = %W{ Région Date Quotité Grade Type Service\ concerné Programme Date\ effective ETPT Mouvements\ en\ gestion\ (LFR) Mouvements\ en\ base\ (PLF\ N+1) N°ref\ redéploiement}
    #attributes = %w{ region_id date quotite grade type_mouvement}

    CSV.generate(headers: true) do |csv|
      csv << header

      all.each do |mouvement|
        #csv << attributes.map {|attr| mouvement.send(attr)}
        csv << [mouvement.region.nom, mouvement.date, mouvement.quotite, mouvement.grade, mouvement.type_mouvement, mouvement.service.nom, mouvement.programme.numero, mouvement.date_effet, mouvement.etpt, mouvement.credits_gestion, mouvement.cout_etp, mouvement.mouvement_lien]
      end
    end 
  end 

  def self.import(file)
    Mouvement.destroy_all
    Redeploiement.destroy_all

    @redeploiement = Redeploiement.new 
    @redeploiement.region_id = Region.first.id 
    @redeploiement.ajout = 0
    @redeploiement.suppression = 0
    @redeploiement.cout_etp = 0
    @redeploiement.credits_gestion = 0
    @redeploiement.save

    data = Roo::Spreadsheet.open(file.path)
    headers = data.row(1) # get header row
    data.each_with_index do |row, idx|
        next if idx == 0 # skip header
        row_data = Hash[[headers, row].transpose]
        mouvement = Mouvement.new 
        mouvement.date = row_data['Date'].to_date
        mouvement.type_mouvement = row_data['Type']
        mouvement.user_id = User.where(statut: 'CBR', region_id: Region.where(nom: row_data['Region']).first.id).first.id
        mouvement.region_id = Region.where(nom: row_data['Region']).first.id
        mouvement.quotite = row_data['Quotité ETP'].to_f.round(1)
        mouvement.grade = row_data['Macrograde']
        mouvement.date_effet = row_data['Date effective mouvement'].to_date
        mouvement.service_id = Service.where(nom: row_data['Service concerné ']).first.id
        mouvement.programme_id = Programme.where(numero: row_data['Programme'].to_i).first.id
        
        mouvement.credits_gestion = row_data['Mouvements en gestion'].to_f
        mouvement.cout_etp = row_data['Mouvement en base (PLF N+1)'].to_f
        if row_data['Mouvement en base (PLF N+1)'].to_f.to_i == 0
          mouvement.ponctuel = true
        else
          mouvement.ponctuel = false
        end
        mouvement.mouvement_lien = row_data['N° ref mouvement'][1..].to_i
        if row_data['Type'] == "ajout"
          mouvement.etpt = (row_data['Quotité ETP'].to_f * (DateTime.new(2022,12,31)-row_data['Date effective mouvement'].to_date).to_i / 365).round(2)
        else 
          mouvement.etpt = (row_data['Quotité ETP'].to_f * (row_data['Date effective mouvement'].to_date-DateTime.new(2022,1,1)).to_i / 365).round(2)
        end 
        mouvement.redeploiement = @redeploiement
        mouvement.save
        mouvement.created_at = row_data['Date'].to_date
        mouvement.save

    end

    @numeros = Mouvement.all.pluck(:mouvement_lien).uniq
    @numeros.each do |numero|
      @redeploiement = Redeploiement.new
      @redeploiement.region_id = Mouvement.where(mouvement_lien: numero).first.region_id
      @redeploiement.ajout = Mouvement.where(mouvement_lien: numero, type_mouvement: "ajout").count
      @redeploiement.suppression =Mouvement.where(mouvement_lien: numero, type_mouvement: "suppression").count
      @redeploiement.cout_etp = Mouvement.where(mouvement_lien: numero).sum(:cout_etp).to_i
      @redeploiement.credits_gestion = Mouvement.where(mouvement_lien: numero).sum(:credits_gestion).to_i
      @redeploiement.save
      @redeploiement.created_at = Mouvement.where(mouvement_lien: numero).first.date
      @redeploiement.save
      #on remet à jour les numero des mouvements 
      Mouvement.where(mouvement_lien: numero).each do |mvt|
        mvt.redeploiement = @redeploiement
        mvt.save
      end
    end
    Redeploiement.first.destroy
  end

end
