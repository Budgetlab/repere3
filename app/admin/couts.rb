ActiveAdmin.register Cout do
  permit_params :categorie, :cout, :programme_id

  index do
    selectable_column
    id_column
    column :categorie
    column :cout
    column :programme
    actions
  end

  show do
    attributes_table do
      row :categorie
      row :cout
      row :programme
    end
  end

  form do |f|
    f.inputs do
      f.input :categorie
      f.input :cout
      f.input :programme
    end
    f.actions
  end
end
