class RegionsController < ApplicationController
  before_action :authenticate_user!
  protect_from_forgery with: :null_session
  require 'axlsx'

  def index
    @regions = Region.all.order(nom: :asc) 
    if current_user.statut == "ministere"
      @programme_id = Ministere.where(nom: current_user.nom).programmes.pluck(:id)
    else
      @programme_id = Programme.all.pluck(:id).uniq
    end
    respond_to do |format|
        format.html
        format.xlsx {
            response.headers['Content-Disposition'] = 'attachment; filename="synthese_region.xlsx"'
          }
    end
  end
end
