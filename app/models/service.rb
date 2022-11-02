class Service < ApplicationRecord
  belongs_to :programme
  has_many :mouvements
  require 'roo'
  require 'axlsx'

  def self.import(file)

    data = Roo::Spreadsheet.open(file.path)
    headers = data.row(1) # get header row
    
    Service.all.each do |service| #on regarde si le service est dans le fichier
      count = 0 
      data.each_with_index do |row, idx|
        next if idx == 0 # skip header
          row_data = Hash[[headers, row].transpose]
          if row_data['Nom'] == service.nom && row_data['Numero'].to_i == service.programme_id
            count += 1
          end 
      end
      if count == 0  #si nest pas dans le fichier on le supp ainsi que les mouvements associes
        if Mouvement.where(service_id: service.id).count == 0
          Mouvement.where(service_id: service.id).destroy_all
          service.destroy
        end
      end
    end

    data.each_with_index do |row, idx|
      next if idx == 0 # skip header
      row_data = Hash[[headers, row].transpose]
      if Programme.where('numero = ?',row_data['Numero'].to_i).count > 0
        if Service.where('nom = ? AND programme_id = ?',row_data['Nom'].to_s,Programme.where('numero = ?',row_data['Numero'].to_i).first.id).count > 0 #service existe deja
            @service = Service.where('nom = ?',row_data['Nom'].to_s).first
        else
            @service = Service.new 
            @service.nom = row_data['Nom']
            @service.programme_id = Programme.where('numero = ?',row_data['Numero'].to_i).first.id
            @service.save
        end
      end
    end
  end
end
