class PagesController < ApplicationController
  before_action :authenticate_user!

  def accueil
    @annee_a_afficher = (2023..Date.today.year).include?(params[:annee].to_i) ? params[:annee].to_i : @annee
    set_objectifs(@annee_a_afficher)
    set_mouvements(@annee_a_afficher)
    set_regions
    set_programmes
    compute_totaux_accueil(@mouvements_all, @objectifs)

    stats = AccueilStatsService.new(
      @objectifs.to_a, @mouvements_all.to_a, @programmes, @regions, @annee_a_afficher
    )

    @data_par_programme  = stats.data_par_programme
    @mvt_programme_etp   = stats.mvt_programme_etp
    @data_par_macrograde = stats.data_par_macrograde
    @date_effet_ajout    = stats.date_effet_ajout
    @date_effet_supp     = stats.date_effet_supp
    @creation_ajout      = stats.creation_ajout
    @creation_supp       = stats.creation_supp

    return unless %w[admin ministere].include?(current_user.statut)

    @data_par_region = stats.data_par_region
    @mvt_region_etp  = stats.mvt_region_etp
  end

  def error_404
    if params[:path] && params[:path] == '500'
      render 'error_500'
    else
      render status: 404
    end
  end

  def error_500
    render status: 500
  end

  def mentions_legales; end

  def accessibilite; end

  def donnees_personnelles; end

  def plan; end

  def faq; end

end
