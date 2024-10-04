class Service < ApplicationRecord
  belongs_to :programme
  has_many :mouvements
  require 'roo'
  require 'axlsx'

  def self.import(file)

    data = Roo::Spreadsheet.open(file.path)
    headers = data.row(1) # get header row
    # @services_nom = data.column(1)
    #Service.all.each do |service| #on regarde si le service est dans le fichier
    #  unless @services_nom.include?(service.nom)
    #    Mouvement.where(service_id: service.id).destroy_all
    #    service.destroy
    #  end
    #end
    data.each_with_index do |row, idx|
      next if idx == 0 # skip header
      row_data = Hash[[headers, row].transpose]
      if Programme.where(numero: row_data['Numero'].to_i).count > 0
        if Service.where(nom: row_data['Nom'].to_s, programme_id: Programme.where(numero: row_data['Numero'].to_i).first.id).count.zero?
          @service = Service.new 
          @service.nom = row_data['Nom']
          @service.programme_id = Programme.where(numero: row_data['Numero'].to_i).first.id
          @service.save
        end
      end
    end
  end

  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "id", "id_value", "nom", "programme_id", "updated_at"]
  end
  def self.ransackable_associations(auth_object = nil)
    ["mouvements", "programme"]
  end
end
