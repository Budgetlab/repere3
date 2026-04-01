ActiveAdmin.register Service do
  permit_params :nom, :programme_id

  index do
    selectable_column
    id_column
    column :nom
    column :programme
    actions
  end

  show do
    attributes_table do
      row :nom
      row :programme
    end
  end

  form do |f|
    f.inputs do
      f.input :nom
      f.input :programme
    end
    f.actions
  end
end
