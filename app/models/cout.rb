class Cout < ApplicationRecord
  belongs_to :programme

  require 'roo'
  require 'axlsx'

  def self.import(file)
    data = Roo::Spreadsheet.open(file.path)
    headers = data.row(1)
    data.each_with_index do |row, idx|
      next if idx == 0
      row_data = Hash[[headers, row].transpose]
      next unless row_data['Programme'].present? && row_data['Categorie'].present?

      programme = Programme.find_by(numero: row_data['Programme'].to_i)
      next unless programme

      cout = Cout.find_or_initialize_by(programme: programme, categorie: row_data['Categorie'])
      cout.cout = row_data['Cout'].to_f
      cout.save
    end
  end

  def self.ransackable_associations(auth_object = nil)
    ["programme"]
  end
  def self.ransackable_attributes(auth_object = nil)
    ["categorie", "cout", "created_at", "id", "id_value", "programme_id", "updated_at"]
  end
end
