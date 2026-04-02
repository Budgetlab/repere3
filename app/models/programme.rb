class Programme < ApplicationRecord
  belongs_to :ministere

  def to_s
    "#{numero} - #{nom}"
  end
  has_many :services
  has_many :couts
  has_many :objectifs
  has_many :mouvements

  require 'roo'
  require 'axlsx'

  def self.import(file)
    data = Roo::Spreadsheet.open(file.path)
    headers = data.row(1)
    data.each_with_index do |row, idx|
      next if idx == 0
      row_data = Hash[[headers, row].transpose]

      if row_data['Ministere'].present?
        Ministere.where(nom: row_data['Ministere'].to_s).first_or_create
      end

      next unless row_data['Numero'].present?

      programme = Programme.find_or_initialize_by(numero: row_data['Numero'].to_i)
      programme.nom = row_data['Nom programme']
      programme.ministere = Ministere.find_by(nom: row_data['Ministere'].to_s)
      programme.save
    end
  end

  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "id", "id_value", "ministere_id", "nom", "numero", "updated_at"]
  end
  def self.ransackable_associations(auth_object = nil)
    ["couts", "ministere", "mouvements", "objectifs", "services"]
  end
end
