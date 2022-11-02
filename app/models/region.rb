class Region < ApplicationRecord
	has_many :objectifs
  	has_many :mouvements
end
