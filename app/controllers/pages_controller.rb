class PagesController < ApplicationController
  before_action :authenticate_user!

  def accueil
    @annee_a_afficher = (2023..Date.today.year).include?(params[:annee].to_i) ? params[:annee].to_i : @annee
    set_objectifs(@annee_a_afficher)
    set_mouvements(@annee_a_afficher)
    set_regions
    set_programmes
    compute_totaux_accueil(@mouvements_all, @objectifs)

    objectifs_arr  = @objectifs.to_a
    mouvements_arr = @mouvements_all.to_a

    @data_par_programme = @programmes.map do |prog|
      obj   = objectifs_arr.select { |o| o.programme_id == prog.id }
      mvts  = mouvements_arr.select { |m| m.programme_id == prog.id }
      supp  = mvts.select { |m| m.type_mouvement == 'suppression' }
      ajout = mvts.select { |m| m.type_mouvement == 'ajout' }
      etp_c     = obj.sum { |o| o.etp_cible.to_f }
      plafond_3 = (0.03 * etp_c).round(1)
      etp_supp  = supp.sum { |m| m.quotite.to_f }
      {
        programme:    prog,
        etp_cible:    etp_c.round(1),
        etpt_plafond: obj.sum { |o| o.etpt_plafond.to_f }.round(1),
        plafond_3:    plafond_3,
        etp_supp:     etp_supp.round(2),
        pct_etp_supp: etp_c > 0 ? (etp_supp / etp_c * 100).round(2) : 0,
        etp_add:      ajout.sum { |m| m.quotite.to_f }.round(2),
        etpt_supp:    supp.sum { |m| m.etpt.to_f }.round(2),
        etpt_add:     ajout.sum { |m| m.etpt.to_f }.round(2),
        credits:      mvts.sum { |m| m.credits_gestion.to_f }.to_i,
        couts:        mvts.sum { |m| m.cout_etp.to_f }.to_i
      }
    end

    @mvt_programme_etp = @programmes.flat_map do |prog|
      mvts = mouvements_arr.select { |m| m.programme_id == prog.id }
      ['ajout', 'suppression'].flat_map do |type|
        ['A', 'B', 'C'].map do |grade|
          mvts.select { |m| m.type_mouvement == type && m.grade == grade }.sum { |m| m.quotite.to_f }.round(1)
        end
      end
    end

    if ['admin', 'ministere'].include?(current_user.statut)
      @mvt_region_etp = @regions.flat_map do |region|
        mvts = mouvements_arr.select { |m| m.region_id == region.id }
        ['ajout', 'suppression'].flat_map do |type|
          ['A', 'B', 'C'].map do |grade|
            mvts.select { |m| m.type_mouvement == type && m.grade == grade }.sum { |m| m.quotite.to_f }.round(1)
          end
        end
      end

      @data_par_region = @regions.map do |region|
        obj   = objectifs_arr.select { |o| o.region_id == region.id }
        mvts  = mouvements_arr.select { |m| m.region_id == region.id }
        supp  = mvts.select { |m| m.type_mouvement == 'suppression' }
        ajout = mvts.select { |m| m.type_mouvement == 'ajout' }
        etp_c     = obj.sum { |o| o.etp_cible.to_f }
        plafond_3 = (0.03 * etp_c).round(1)
        etp_supp  = supp.sum { |m| m.quotite.to_f }
        {
          nom:          region.nom,
          etp_cible:    etp_c.round(1),
          etpt_plafond: obj.sum { |o| o.etpt_plafond.to_f }.round(1),
          plafond_3:    plafond_3,
          etp_supp:     etp_supp.round(2),
          pct_etp_supp: etp_c > 0 ? (etp_supp / etp_c * 100).round(2) : 0,
          etp_add:      ajout.sum { |m| m.quotite.to_f }.round(2),
          etpt_supp:    supp.sum { |m| m.etpt.to_f }.round(2),
          etpt_add:     ajout.sum { |m| m.etpt.to_f }.round(2),
          credits:      mvts.sum { |m| m.credits_gestion.to_f }.to_i,
          couts:        mvts.sum { |m| m.cout_etp.to_f }.to_i
        }
      end
    end

    @date_effet_ajout = (1..12).map do |m|
      mouvements_arr.select { |mv| mv.type_mouvement == 'ajout' && mv.date_effet&.year == @annee_a_afficher && mv.date_effet.month == m }.sum { |mv| mv.quotite.to_f }.round(1)
    end
    @date_effet_supp = (1..12).map do |m|
      mouvements_arr.select { |mv| mv.type_mouvement == 'suppression' && mv.date_effet&.year == @annee_a_afficher && mv.date_effet.month == m }.sum { |mv| mv.quotite.to_f }.round(1)
    end

    @creation_ajout = (1..12).map do |m|
      mouvements_arr.select { |mv| mv.type_mouvement == 'ajout' && mv.created_at.month == m }.sum { |mv| mv.quotite.to_f }.round(1)
    end
    @creation_supp = (1..12).map do |m|
      mouvements_arr.select { |mv| mv.type_mouvement == 'suppression' && mv.created_at.month == m }.sum { |mv| mv.quotite.to_f }.round(1)
    end

    @data_par_macrograde = mouvements_arr.group_by(&:grade).map do |grade, mvts|
      supp  = mvts.select { |m| m.type_mouvement == 'suppression' }
      ajout = mvts.select { |m| m.type_mouvement == 'ajout' }
      {
        macrograde: grade,
        etp_supp:   supp.sum { |m| m.quotite.to_f }.round(2),
        etp_add:    ajout.sum { |m| m.quotite.to_f }.round(2),
        etpt_supp:  supp.sum { |m| m.etpt.to_f }.round(2),
        etpt_add:   ajout.sum { |m| m.etpt.to_f }.round(2)
      }
    end.sort_by { |d| d[:macrograde].to_s }
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
