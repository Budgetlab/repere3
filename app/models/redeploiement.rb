class Redeploiement < ApplicationRecord
  belongs_to :region
  has_many :mouvements, dependent: :destroy

end
