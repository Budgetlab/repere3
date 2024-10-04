class Region < ApplicationRecord
	has_many :objectifs
	has_many :mouvements

	def self.ransackable_associations(auth_object = nil)
		["mouvements", "objectifs"]
	end
	def self.ransackable_attributes(auth_object = nil)
		["created_at", "id", "id_value", "nom", "updated_at"]
	end
end
