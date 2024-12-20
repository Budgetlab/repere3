ActiveAdmin.register Mouvement do

  # See permitted parameters documentation:
  # https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  #
  # Uncomment all parameters which should be permitted for assignment
  #
  permit_params :date, :user_id, :region_id, :quotite, :grade, :date_effet, :type_mouvement, :service_id, :programme_id, :cout_etp, :ponctuel, :mouvement_lien, :credits_gestion, :etpt, :redeploiement_id
  #
  # or
  #
  # permit_params do
  #   permitted = [:date, :user_id, :region_id, :quotite, :grade, :date_effet, :type_mouvement, :service_id, :programme_id, :cout_etp, :ponctuel, :mouvement_lien, :credits_gestion, :etpt, :redeploiement_id]
  #   permitted << :other if params[:action] == 'create' && current_user.admin?
  #   permitted
  # end
  
end
