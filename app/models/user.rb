class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  def self.import(file)
    User.destroy_all 
    Region.destroy_all
    data = Roo::Spreadsheet.open(file.path)
    headers = data.row(1) # get header row

    data.each_with_index do |row, idx|
      next if idx == 0 # skip header
      row_data = Hash[[headers, row].transpose]
      if !row_data['region'].nil? && row_data['region'].length > 0 #region existe
        Region.where('nom = ?',row_data['region']).first_or_create do |region|
          region.nom = row_data['region']
        end
      end

      if row_data['email'] != "" 
        User.where('email = ?',row_data['email']).first_or_create do |user|         
          user.email = row_data['email']
          user.statut = row_data['statut']
          if Region.where('nom = ?',row_data['region']).count > 0
            user.region_id = Region.where('nom = ?',row_data['region']).first.id
          end
          user.nom = row_data['nom']
          user.password = row_data['Mot de passe']
        end
      end

    end
  end

  def self.authentication_keys
    {statut: true, nom: false, region_id: false}
  end

  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "email", "encrypted_password", "id", "id_value", "nom", "region_id", "remember_created_at", "reset_password_sent_at", "reset_password_token", "statut", "updated_at"]
  end

end
