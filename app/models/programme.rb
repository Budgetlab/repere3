class Programme < ApplicationRecord
  belongs_to :ministere
  has_many :services
  has_many :couts
  has_many :objectifs
  has_many :mouvements
  require 'roo'
  require 'axlsx'

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
end
