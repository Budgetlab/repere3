ActiveAdmin.register Ministere do
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
      row :programmes do |m|
        m.programmes.map(&:to_s).join(", ")
      end
    end
  end

  form do |f|
    f.inputs do
      f.input :nom
    end
    f.actions
  end
end
