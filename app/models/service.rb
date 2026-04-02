class Service < ApplicationRecord
  belongs_to :programme

  def to_s
    nom
  end
  has_many :mouvements
  require 'roo'
  require 'axlsx'

  def self.import(file)
    data = Roo::Spreadsheet.open(file.path)
    headers = data.row(1) # get header row
    data.each_with_index do |row, idx|
      next if idx == 0 # skip header
      row_data = Hash[[headers, row].transpose]
      next unless row_data['Nom'].present? && row_data['Numero'].present?

      programme = Programme.find_by(numero: row_data['Numero'].to_i)
      next unless programme

      service = Service.find_or_initialize_by(nom: row_data['Nom'], programme_id: programme.id)
      service.save
    end
  end

  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "id", "id_value", "nom", "programme_id", "updated_at"]
  end
  def self.ransackable_associations(auth_object = nil)
    ["mouvements", "programme"]
  end
end
