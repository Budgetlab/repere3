# frozen_string_literal: true

# Controller Programmes
class ProgrammesController < ApplicationController
  before_action :authenticate_user!
  protect_from_forgery with: :null_session
  require 'axlsx'

  def index
    @programmes = Programme.includes(:ministere).order(numero: :asc)
  end

  def synthese
    @annee_a_afficher = (2023..Date.today.year).include?(params[:annee].to_i) ? params[:annee].to_i : @annee
    @date_debut = Date.new(@annee_a_afficher, 1, 1)
    @date_fin = Date.new(@annee_a_afficher, 12, 31)
    @programmes = Programme.all.order(numero: :asc)
    cbr_ou_dcb = current_user.statut == 'CBR' || current_user.statut == 'prefet'
    @region_id = cbr_ou_dcb ? current_user.region_id : Region.all.pluck(:id).uniq
    response.headers['Content-Disposition'] = 'attachment; filename="synthese_programme.xlsx"'
    render :synthese
  end

  def import
    Programme.import(params[:file])
    respond_to do |format|
      format.turbo_stream { redirect_to programmes_path }
    end
  end

end
