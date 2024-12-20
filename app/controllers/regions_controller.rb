# frozen_string_literal: true

# Controller Regions
class RegionsController < ApplicationController
  before_action :authenticate_user!
  protect_from_forgery with: :null_session
  require 'axlsx'

  # Page pour exporter le fichier excel synthese régional
  def index
    @annee_a_afficher = [2023, 2024, 2025].include?(params[:annee].to_i) ? params[:annee].to_i : @annee
    @date_debut = Date.new(@annee_a_afficher, 1, 1)
    @date_fin = Date.new(@annee_a_afficher, 12, 31)
    @regions = Region.all.order(nom: :asc)
    @programme_id = current_user.statut == 'ministere' ? Ministere.where(nom: current_user.nom).programmes.pluck(:id) : Programme.all.pluck(:id).uniq
    respond_to do |format|
      format.html
      format.xlsx do
        response.headers['Content-Disposition'] = 'attachment; filename="synthese_region.xlsx"'
      end
    end
  end
end
