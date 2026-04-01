ActiveAdmin.register Objectif do
  permit_params :date, :etp_cible, :etpt_plafond, :region_id, :programme_id

  index do
    selectable_column
    id_column
    column :date
    column :region
    column :programme
    column :etp_cible
    column :etpt_plafond
    actions
  end

  show do
    attributes_table do
      row :date
      row :region
      row :programme
      row :etp_cible
      row :etpt_plafond
    end
  end

  form do |f|
    f.inputs do
      f.input :date, as: :date_picker
      f.input :region
      f.input :programme
      f.input :etp_cible
      f.input :etpt_plafond
    end
    f.actions
  end
end
