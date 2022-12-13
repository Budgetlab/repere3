class PagesController < ApplicationController
  before_action :authenticate_user!

  def accueil

    @start = Date.new(Date.today.year,1,1)
    @end = Date.new(Date.today.year,12,31)

    if current_user.statut == "admin"
      @mouvements = Mouvement.where('date >= ? AND date <= ?',@start,@end).order(date: :desc)
      @objectifs = Objectif.where('date >= ? AND date <= ?',@start,@end)
      @programmes = Programme.all.order(numero: :asc)
    elsif current_user.statut == "prefet" || current_user.statut == "CBR"
      @mouvements = Mouvement.where(region_id: current_user.region_id).where('date >= ? AND date <= ?',@start,@end).order(date: :desc)      
      @objectifs = Objectif.where('region_id = ? AND date >= ? AND date <= ?',current_user.region_id, @start,@end)
      @programmes = Programme.all.order(numero: :asc)
    elsif current_user.statut == "ministere"
      @ministere = Ministere.where(nom: current_user.nom).first
      @programme_id = Programme.where(ministere_id: @ministere.id).pluck(:id)
      @mouvements = Mouvement.where(programme_id: @programme_id).where('date >= ? AND date <= ?',@start,@end).order(date: :desc)     
      @objectifs = Objectif.where(programme_id: @programme_id).where('date >= ? AND date <= ?',@start,@end)         
      @programmes = Programme.where(ministere_id: @ministere.id).order(numero: :asc)      
    end

    @etp_cible = @objectifs.sum('etp_cible').round(1)
    @etp_3 = (0.03 * @etp_cible).round(1)
    @etpt_plafond = @objectifs.sum('etpt_plafond').round(2)
    @etp_supp = @mouvements.where(type_mouvement: "suppression").sum('quotite').round(1)  

    @etp_supp_a = @mouvements.where('type_mouvement = ? AND grade = ?', "suppression", 'A').sum('quotite').round(1)
    @etp_supp_b = @mouvements.where('type_mouvement = ? AND grade = ?', "suppression", 'B').sum('quotite').round(1)
    @etp_supp_c = @mouvements.where('type_mouvement = ? AND grade = ?', "suppression", 'C').sum('quotite').round(1)
    @etp_add = @mouvements.where(type_mouvement: "ajout").sum('quotite').round(1)
    @etp_add_a = @mouvements.where('type_mouvement = ? AND grade = ?', "ajout", 'A').sum('quotite').round(1)
    @etp_add_b = @mouvements.where('type_mouvement = ? AND grade = ?', "ajout", 'B').sum('quotite').round(1)
    @etp_add_c = @mouvements.where('type_mouvement = ? AND grade = ?', "ajout", 'C').sum('quotite').round(1)

    @etpt_supp = @mouvements.where(type_mouvement: "suppression").sum('etpt').round(2)
    @etpt_supp_a = @mouvements.where('type_mouvement = ? AND grade = ?', "suppression", 'A').sum('etpt').round(2)
    @etpt_supp_b = @mouvements.where('type_mouvement = ? AND grade = ?', "suppression", 'B').sum('etpt').round(2)
    @etpt_supp_c = @mouvements.where('type_mouvement = ? AND grade = ?', "suppression", 'C').sum('etpt').round(2)
    @etpt_add = @mouvements.where(type_mouvement: "ajout").sum('etpt').round(2)
    @etpt_add_a = @mouvements.where('type_mouvement = ? AND grade = ?', "ajout", 'A').sum('etpt').round(2)
    @etpt_add_b = @mouvements.where('type_mouvement = ? AND grade = ?', "ajout", 'B').sum('etpt').round(2)
    @etpt_add_c = @mouvements.where('type_mouvement = ? AND grade = ?', "ajout", 'C').sum('etpt').round(2)

    @regions = Region.all.order(nom: :asc)
    @etp_supp_region = []
    @etp_plafond = []
    @etp_region = []
    @regions.each do |region|
      @etp_region << @mouvements.where('type_mouvement = ? AND grade = ? AND region_id = ?', "ajout", 'A', region.id).sum('quotite').round(1)
      @etp_region << @mouvements.where('type_mouvement = ? AND grade = ? AND region_id = ?', "ajout", 'B', region.id).sum('quotite').round(1)
      @etp_region << @mouvements.where('type_mouvement = ? AND grade = ? AND region_id = ?', "ajout", 'C', region.id).sum('quotite').round(1)
      @etp_region << @mouvements.where('type_mouvement = ? AND grade = ? AND region_id = ?', "suppression", 'A', region.id).sum('quotite').round(1)      
      @etp_region << @mouvements.where('type_mouvement = ? AND grade = ? AND region_id = ?', "suppression", 'B', region.id).sum('quotite').round(1)
      @etp_region << @mouvements.where('type_mouvement = ? AND grade = ? AND region_id = ?', "suppression", 'C', region.id).sum('quotite').round(1)

      @etp_supp_region << @mouvements.where(region_id: region.id, type_mouvement: "suppression").sum('quotite').round(1)
      @etp_plafond << (0.03*Objectif.where('region_id = ? AND date >= ? AND date <= ?',region.id,@start,@end).sum('etp_cible')).round(1)
    end

    @ept_prog = []
    @etp_supp_prog = []
    @programmes.each do |programme|
      @ept_prog << @mouvements.where('type_mouvement = ? AND grade = ? AND programme_id = ?', "ajout", 'A', programme.id).sum('quotite').round(1)
      @ept_prog << @mouvements.where('type_mouvement = ? AND grade = ? AND programme_id = ?', "ajout", 'B', programme.id).sum('quotite').round(1)
      @ept_prog << @mouvements.where('type_mouvement = ? AND grade = ? AND programme_id = ?', "ajout", 'C', programme.id).sum('quotite').round(1)
      @ept_prog << @mouvements.where('type_mouvement = ? AND grade = ? AND programme_id = ?', "suppression", 'A', programme.id).sum('quotite').round(1)      
      @ept_prog << @mouvements.where('type_mouvement = ? AND grade = ? AND programme_id = ?', "suppression", 'B', programme.id).sum('quotite').round(1)
      @ept_prog << @mouvements.where('type_mouvement = ? AND grade = ? AND programme_id = ?', "suppression", 'C', programme.id).sum('quotite').round(1)
     
      @etp_supp_prog << @mouvements.where('type_mouvement = ? AND programme_id = ?', "suppression", programme.id).sum('quotite').round(1)
     end 

    @mouvements_ajout = []
    @etp_time_ajout = []
    @mouvements_supp = []
    @etp_time_supp = []
    (0..11).to_a.each do |i|
      @mouvements_ajout << @mouvements.where(type_mouvement: "suppression").where('date >= ? AND date <= ?', @start + i.month, @start + i.month + 1.month - 1.day).sum('quotite').round(1)
      @mouvements_supp <<  @mouvements.where(type_mouvement: "ajout").where('date >= ? AND date <= ?', @start + i.month, @start + i.month + 1.month - 1.day).sum('quotite').round(1)
      @etp_time_ajout << @mouvements.where(type_mouvement: "ajout").where('date_effet >= ? AND date_effet <= ?', @start + i.month, @start + i.month + 1.month - 1.day).sum('quotite').round(1)
      @etp_time_supp << @mouvements.where(type_mouvement: "suppression").where('date_effet >= ? AND date_effet <= ?', @start + i.month, @start + i.month + 1.month - 1.day).sum('quotite').round(1)
    end
  end

  def error_404
    if params[:path] && params[:path] == "500"
      render 'error_500'
    else 
      render status: 404
    end 
  end 

  def error_500
    render status: 500
  end

  def mentions_legales
  end 
  
  def accessibilite
  end

  def donnees_personnelles
  end

  def plan 
  end 

  def faq
  end 
end
