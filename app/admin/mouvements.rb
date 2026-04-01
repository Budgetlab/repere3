ActiveAdmin.register Mouvement do
  permit_params :date, :user_id, :region_id, :quotite, :grade, :date_effet,
                :type_mouvement, :service_id, :programme_id, :cout_etp,
                :ponctuel, :mouvement_lien, :credits_gestion, :etpt, :redeploiement_id

  index do
    selectable_column
    id_column
    column :date
    column :type_mouvement
    column :region
    column :programme
    column :service
    column :grade
    column :quotite
    column :etpt
    actions
  end

  show do
    attributes_table do
      row :date
      row :type_mouvement
      row :region
      row :programme
      row :service
      row :user
      row :grade
      row :quotite
      row :etpt
      row :date_effet
      row :cout_etp
      row :credits_gestion
      row :ponctuel
      row :mouvement_lien
      row :redeploiement
    end
  end

  form do |f|
    f.inputs do
      f.input :date, as: :date_picker
      f.input :type_mouvement
      f.input :region
      f.input :programme
      f.input :service
      f.input :user
      f.input :grade
      f.input :quotite
      f.input :etpt
      f.input :date_effet, as: :date_picker
      f.input :cout_etp
      f.input :credits_gestion
      f.input :ponctuel
      f.input :mouvement_lien
      f.input :redeploiement
    end
    f.actions
  end
end
