# frozen_string_literal: true

# Controller Programmes
class ProgrammesController < ApplicationController
  before_action :authenticate_user!
  protect_from_forgery with: :null_session
  require 'axlsx'

  # Page pour ajouter les programmes et effectuer export excel de synthese des programmes
  def index
    @annee_a_afficher = [2023, 2024, 2025].include?(params[:annee].to_i) ? params[:annee].to_i : @annee
    @date_debut = Date.new(@annee_a_afficher, 1, 1)
    @date_fin = Date.new(@annee_a_afficher, 12, 31)
    @programmes = Programme.all.order(numero: :asc)
    cbr_ou_dcb = current_user.statut == 'CBR' || current_user.statut == 'prefet'
    @region_id = cbr_ou_dcb ? current_user.region_id : Region.all.pluck(:id).uniq
    respond_to do |format|
      format.html
      format.xlsx do
        response.headers['Content-Disposition'] = 'attachment; filename="synthese_programme.xlsx"'
      end
    end
  end

  def import
    Programme.import(params[:file])
    respond_to do |format|
      format.turbo_stream { redirect_to programmes_path }
    end
  end

end
