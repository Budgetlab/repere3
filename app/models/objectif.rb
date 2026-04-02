class Objectif < ApplicationRecord
  belongs_to :region
  belongs_to :programme
  require 'roo'
  require 'axlsx'

  def self.import(file)
    year = Date.today.year
    date_year = Date.new(year, 1, 1)
    data = Roo::Spreadsheet.open(file.path)
    headers = data.row(1) # get header row
    data.each_with_index do |row, idx|
      next if idx == 0 # skip header

      row_data = Hash[[headers, row].transpose]
      next unless row_data['programme'].present? && row_data['region'].present? && row_data['etp cible'].present? && row_data['etpt plafond'].present?

      programme = Programme.find_by(numero: row_data['programme'].to_i)
      region = Region.find_by(nom: row_data['region'])
      next unless programme && region

      objectif = Objectif.find_or_initialize_by(programme_id: programme.id, region_id: region.id, date: date_year)
      objectif.etp_cible = row_data['etp cible'].to_f.round(1)
      objectif.etpt_plafond = row_data['etpt plafond'].to_f.round(2)
      objectif.save
    end
  end
  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "date", "etp_cible", "etpt_plafond", "id", "id_value", "programme_id", "region_id", "updated_at"]
  end
  def self.ransackable_associations(auth_object = nil)
    ["programme", "region"]
  end
end
