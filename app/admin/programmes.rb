ActiveAdmin.register Programme do
  permit_params :ministere_id, :numero, :nom

  index do
    selectable_column
    id_column
    column :numero
    column :nom
    column :ministere
    actions
  end

  show do
    attributes_table do
      row :numero
      row :nom
      row :ministere
    end
  end

  form do |f|
    f.inputs do
      f.input :ministere
      f.input :numero
      f.input :nom
    end
    f.actions
  end
end
