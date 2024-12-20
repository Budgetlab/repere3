ActiveAdmin.register Objectif do

  # See permitted parameters documentation:
  # https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  #
  # Uncomment all parameters which should be permitted for assignment
  #
  permit_params :date, :etp_cible, :etpt_plafond, :region_id, :programme_id
  #
  # or
  #
  # permit_params do
  #   permitted = [:date, :etp_cible, :etpt_plafond, :region_id, :programme_id]
  #   permitted << :other if params[:action] == 'create' && current_user.admin?
  #   permitted
  # end
  
end
