ActiveAdmin.register Region do
  permit_params :nom

  index do
    selectable_column
    id_column
    column :nom
    actions
  end

  show do
    attributes_table do
      row :nom
    end
  end

  form do |f|
    f.inputs do
      f.input :nom
    end
    f.actions
  end
end
