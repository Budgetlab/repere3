ActiveAdmin.register Redeploiement do

  # See permitted parameters documentation:
  # https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  #
  # Uncomment all parameters which should be permitted for assignment
  #
  permit_params :region_id, :ajout, :suppression, :cout_etp, :credits_gestion
  #
  # or
  #
  # permit_params do
  #   permitted = [:region_id, :ajout, :suppression, :cout_etp, :credits_gestion]
  #   permitted << :other if params[:action] == 'create' && current_user.admin?
  #   permitted
  # end
  
end
