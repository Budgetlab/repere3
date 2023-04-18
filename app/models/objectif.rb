class Objectif < ApplicationRecord
  belongs_to :region
  belongs_to :programme
  require 'roo'
  require 'axlsx'

  def self.import(file)
    Objectif.where(date: Date.new(2023,1,1)).destroy_all

    data = Roo::Spreadsheet.open(file.path)
    headers = data.row(1) # get header row
    data.each_with_index do |row, idx|
      next if idx == 0 # skip header
      row_data = Hash[[headers, row].transpose]
      if Programme.where(numero: row_data['programme'].to_i).count > 0 && Region.where(nom: row_data['region']).count > 0
          @objectif = Objectif.new
          @objectif.date = Date.new(2023,1,1)
          @objectif.etp_cible = row_data['etp cible'].to_f.round(1)
          @objectif.etpt_plafond = row_data['etpt plafond'].to_f.round(2)
          @objectif.region_id = Region.where(nom: row_data['region']).first.id
          @objectif.programme_id = Programme.where(numero: row_data['programme'].to_i).first.id
          @objectif.save
      end
      end
  end
end
