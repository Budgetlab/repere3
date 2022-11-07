class RegionsController < ApplicationController
  before_action :authenticate_user!
  protect_from_forgery with: :null_session
    
  def index
    @regions = Region.all.order(nom: :asc) 
    if current_user.statut == "ministere"
      @programme_id = Ministere.where(nom: current_user.nom).programmes.pluck(:id)
    else
      @programme_id = Programme.all.pluck(:id).uniq
    end
    respond_to do |format|
        format.html
        format.csv {send_data @regions.to_csv(@programme_id), type: 'text/csv', disposition: 'attachment', filename: "synthese_regions.csv"}
    end
  end
end
