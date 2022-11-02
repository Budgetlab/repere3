class Cout < ApplicationRecord
  belongs_to :programme

  require 'roo'
  require 'axlsx'

  def self.import(file)
      Cout.destroy_all
      data = Roo::Spreadsheet.open(file.path)
      headers = data.row(1) # get header row
      data.each_with_index do |row, idx|
          next if idx == 0 # skip header
          row_data = Hash[[headers, row].transpose]
          if Programme.where('numero = ?',row_data['Programme'].to_i).count > 0
            @cout = Cout.new 
            @cout.categorie = row_data['Categorie']
            @cout.programme_id = Programme.where('numero = ?',row_data['Programme'].to_i).first.id
            @cout.cout = row_data['Cout'].to_f
            @cout.save  
          end 
      end
  end
end
