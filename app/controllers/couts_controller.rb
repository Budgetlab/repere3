class CoutsController < ApplicationController
  before_action :authenticate_user!
  protect_from_forgery with: :null_session
  before_action :require_admin, except: [:couts]

  # page pour voir tous les couts et importer le fichier des coûts
  def index
    @couts = Cout.all.joins(:programme)
  end

  def import
    Cout.import(params[:file])
    respond_to do |format|
      format.turbo_stream { redirect_to root_path }
    end
  end

  # page Répartition des coûts ETP annuels
  def couts
    @programmes = Programme.all.includes(:ministere, :couts).order(:numero)
  end

end
