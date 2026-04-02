class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  def self.import(file)
    data = Roo::Spreadsheet.open(file.path)
    headers = data.row(1)

    data.each_with_index do |row, idx|
      next if idx == 0
      row_data = Hash[[headers, row].transpose]

      if row_data['region'].present?
        Region.where(nom: row_data['region']).first_or_create
      end

      next unless row_data['email'].present?

      user = User.find_or_initialize_by(email: row_data['email'])
      user.statut = row_data['statut']
      user.nom = row_data['nom']
      user.password = row_data['Mot de passe'] if row_data['Mot de passe'].present?
      region = Region.find_by(nom: row_data['region'])
      user.region_id = region.id if region
      user.save
    end
  end

  def to_s
    nom.presence || email
  end

  def self.authentication_keys
    {statut: true, nom: false, region_id: false}
  end

  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "email", "encrypted_password", "id", "id_value", "nom", "region_id", "remember_created_at", "reset_password_sent_at", "reset_password_token", "statut", "updated_at"]
  end

end
