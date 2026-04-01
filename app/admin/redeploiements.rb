ActiveAdmin.register Redeploiement do
  permit_params :region_id, :ajout, :suppression, :cout_etp, :credits_gestion

  index do
    selectable_column
    id_column
    column :region
    column :ajout
    column :suppression
    column :cout_etp
    column :credits_gestion
    actions
  end

  show do
    attributes_table do
      row :region
      row :ajout
      row :suppression
      row :cout_etp
      row :credits_gestion
    end
  end

  form do |f|
    f.inputs do
      f.input :region
      f.input :ajout
      f.input :suppression
      f.input :cout_etp
      f.input :credits_gestion
    end
    f.actions
  end
end
