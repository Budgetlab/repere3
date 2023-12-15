class PagesController < ApplicationController
  before_action :authenticate_user!

  def accueil
    date_debut = Date.new(@annee, 1, 1)
    date_fin = Date.new(@annee, 12, 31)
    @regions = set_regions
    @programmes = set_programmes
    @ministere = Ministere.where(nom: current_user.nom).first if current_user.statut == 'ministere'

    @array_programme_mvt = @programmes.includes(:mouvements).where(mouvements: { region_id: @regions.pluck(:id), date: date_debut..date_fin }).pluck(:programme_id, :type_mouvement, :quotite, :etpt, :cout_etp, :credits_gestion, :grade)
    @array_programme_obj = @programmes.includes(:objectifs).where(objectifs: { region_id: @regions.pluck(:id), date: date_debut..date_fin }).pluck(:programme_id, :etp_cible, :etpt_plafond)

    @array_region_mvt = @regions.includes(:mouvements).where(mouvements: { programme_id: @programmes.pluck(:id), date: date_debut..date_fin }).pluck(:region_id, :type_mouvement, :quotite, :etpt, :cout_etp, :credits_gestion, :grade)
    @array_region_obj = @regions.includes(:objectifs).where(objectifs: { programme_id: @programmes.pluck(:id), date: date_debut..date_fin }).pluck(:region_id, :etp_cible, :etpt_plafond)

    @etp_cible = @array_programme_obj.sum{ |s| s[1] }.round(1)
    @etpt_plafond = @array_programme_obj.sum{ |s| s[2] }.round(1)
    @etp_3 = (0.03 * @etp_cible).round(1)
    @credits = @array_programme_mvt.sum{ |s| s[5] }.to_i
    @couts_etp = @array_programme_mvt.sum{ |s| s[4] }.to_i

    @etp_supp = []
    @etp_add = []
    @etpt_supp = []
    @etpt_add = []
    ['A', 'B', 'C'].each do |letter|
      @etp_supp << @array_programme_mvt.select { |a| a[1] == 'suppression' && a[6] == letter }.sum { |s| s[2] }.round(1)
      @etp_add << @array_programme_mvt.select { |a| a[1] == 'ajout' && a[6] == letter }.sum { |s| s[2] }.round(1)
      @etpt_supp << @array_programme_mvt.select { |a| a[1] == 'suppression' && a[6] == letter }.sum { |s| s[3] }.round(1)
      @etpt_add << @array_programme_mvt.select { |a| a[1] == 'ajout' && a[6] == letter }.sum { |s| s[3] }.round(1)
    end
    @etp_supp_region = []
    @etp_plafond = []
    @etp_region = []
    @regions.each do |region|
      ['ajout', 'suppression'].each do |action|
        ['A', 'B', 'C'].each do |category|
          @etp_region << @array_region_mvt.select { |a| a[0] == region.id && a[1] == action && a[6] == category }.sum { |s| s[2] }.round(1)
        end
      end
      @etp_supp_region << @array_region_mvt.select { |a| a[0] == region.id && a[1] == 'suppression' }.sum { |s| s[2] }.round(1)
      @etp_plafond << @array_region_obj.select { |a| a[0] == region.id }.sum { |s| 0.03*s[1] }.round(1)
    end

    @ept_prog = []
    @etp_supp_prog = []
    @programmes.each do |programme|
      ['ajout', 'suppression'].each do |action|
        ['A', 'B', 'C'].each do |category|
          @ept_prog << @array_programme_mvt.select { |a| a[0] == programme.id && a[1] == action && a[6] == category }.sum { |s| s[2] }.round(1)
        end
      end
      @etp_supp_prog << @array_programme_mvt.select { |a| a[0] == programme.id && a[1] == 'suppression' }.sum { |s| s[2] }.round(1)
    end

    @mouvements_ajout = []
    @etp_time_ajout = []
    @mouvements_supp = []
    @etp_time_supp = []
    @hash_date = Mouvement.group("DATE_TRUNC('month', date)").group(:type_mouvement).sum(:quotite)
    @hash_date_effet = Mouvement.group("DATE_TRUNC('month', date_effet)").group(:type_mouvement).sum(:quotite)
    (0..11).to_a.each do |i|
      @mouvements_ajout << @hash_date.select { |key, value| key == [Date.new(Date.today.year, i+1, 1), 'ajout'] }.values.sum.round(1)
      @mouvements_supp <<  @hash_date.select { |key, value| key == [Date.new(Date.today.year, i+1, 1), 'suppression'] }.values.sum.round(1)
      @etp_time_ajout << @hash_date_effet.select { |key, value| key == [Date.new(Date.today.year, i+1, 1), 'ajout'] }.values.sum.round(1)
      @etp_time_supp << @hash_date_effet.select { |key, value| key == [Date.new(Date.today.year, i+1, 1), 'suppression'] }.values.sum.round(1)
    end
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

  private
  def set_regions
    ['CBR', 'DCB'].include?(current_user.statut) ? Region.where(id: current_user.region_id) : Region.all.order(nom: :asc)
  end

  def set_programmes
    current_user.statut == 'ministere' ? Programme.where(ministere_id: @ministere.id).order(numero: :asc) : Programme.all.order(numero: :asc)
  end
end
