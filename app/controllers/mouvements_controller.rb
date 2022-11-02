class MouvementsController < ApplicationController
  before_action :authenticate_user!
  protect_from_forgery with: :null_session

  def index
    @start = Date.new(Date.today.year,1,1)
    @end = Date.new(Date.today.year,12,31)
    if current_user.statut == "admin"
      @mouvements = Mouvement.where('date >= ? AND date <= ?',@start,@end).order(created_at: :desc)
      @etp_cible = Objectif.where('date >= ? AND date <= ?',@start,@end).sum('etp_cible')
    elsif current_user.statut == "prefet" || current_user.statut == "CBR"
      @mouvements = Mouvement.where(region_id: current_user.region_id).where('date >= ? AND date <= ?',@start,@end).order(created_at: :desc)      
      @etp_cible = Objectif.where('region_id = ? AND date >= ? AND date <= ?',current_user.region_id, @start,@end).sum('etp_cible')
    elsif current_user.statut == "ministere"
      @ministere = Ministere.where(nom: current_user.nom).first
      @programme_id = Programme.where(ministere_id: @ministere.id).pluck(:id)
      @mouvements = Mouvement.where(programme_id: @programme_id).where('date >= ? AND date <= ?',@start, @end).order(created_at: :desc)     
      @etp_cible = Objectif.where(programme_id: @programme_id).where('date >= ? AND date <= ?',@start,@end).sum('etp_cible')          
    end
    @etp_supp = @mouvements.where(type_mouvement: "suppression").sum('quotite')
    @etp_3 = 0.03 * @etp_cible

    @redeploiements = @mouvements.pluck(:mouvement_lien).uniq
    if @mouvements.count == 0 
      @mouvements = []
    end
    respond_to do |format|
        format.html
        format.csv {send_data @mouvements.to_csv, type: 'text/csv', disposition: 'attachment', filename: "historique.csv"}
    end
  end


  def new 
  end 

  def create
    @lien = Mouvement.count+1
    @suppressions = [params[:grade1],params[:grade2],params[:grade3],params[:grade4]]
    @ajouts = [params[:addgrade1],params[:addgrade2],params[:addgrade3],params[:addgrade4]]
    (1..4).to_a.each do |i|
      if !@suppressions[i-1].nil? && @suppressions[i-1] != ""
        @mouvement = Mouvement.new
        @mouvement.date = Date.today
        @mouvement.type_mouvement = "suppression" 
        @mouvement.user_id = current_user.id
        @mouvement.region_id = current_user.region_id
        @mouvement.quotite = params["quotite#{i}"].to_f
        @mouvement.grade = params["grade#{i}"]
        @mouvement.date_effet = params["date#{i}"].to_date + 1.day
        @mouvement.programme_id = Programme.where(numero: params["programme#{i}"].to_i).first.id
        @mouvement.service_id = Service.where(nom: params["service#{i}"], programme_id: Programme.where(numero: params["programme#{i}"].to_i).first.id).first.id
        @cout_etp = Cout.where('programme_id = ? AND categorie = ?',Programme.where(numero: params["programme#{i}"].to_i).first.id, params["grade#{i}"]).first.cout
        @mouvement.cout_etp = -(params["quotite#{i}"].to_f * @cout_etp).round(2)
        @mouvement.credits_gestion = -(params["quotite#{i}"].to_f * @cout_etp * (DateTime.new(Date.today.year,12,31)-params["date#{i}"].to_date).to_i / 365).round(2)
        @mouvement.etpt =  (params["quotite#{i}"].to_f * (params["date#{i}"].to_date-DateTime.new(Date.today.year,1,1)).to_i / 365).round(2)
        @mouvement.mouvement_lien = @lien
        @mouvement.save 
      end 
      if !@ajouts[i-1].nil? && @ajouts[i-1] != ""
        @mouvement = Mouvement.new
        @mouvement.date = Date.today
        @mouvement.type_mouvement = "ajout" 
        @mouvement.user_id = current_user.id
        @mouvement.region_id = current_user.region_id
        @mouvement.quotite = params["addquotite#{i}"].to_f
        @mouvement.grade = params["addgrade#{i}"]
        @mouvement.date_effet = params["adddate#{i}"].to_date + 1.day
        @mouvement.programme_id = Programme.where(numero: params["addprogramme#{i}"].to_i).first.id
        @mouvement.service_id = Service.where(nom: params["addservice#{i}"], programme_id: Programme.where(numero: params["addprogramme#{i}"].to_i).first.id).first.id
        @cout_etp = Cout.where('programme_id = ? AND categorie = ?',Programme.where(numero: params["addprogramme#{i}"].to_i).first.id, params["addgrade#{i}"]).first.cout
        @mouvement.credits_gestion = (params["addquotite#{i}"].to_f * @cout_etp * (DateTime.new(Date.today.year,12,31)-params["adddate#{i}"].to_date).to_i / 365).round(2)
        @mouvement.etpt =  (params["addquotite#{i}"].to_f * (DateTime.new(Date.today.year,12,31)-params["adddate#{i}"].to_date ).to_i / 365).round(2)
        @mouvement.mouvement_lien = @lien
        if params["ponctuel#{i}"] == true 
          @mouvement.ponctuel = true 
          @mouvement.cout_etp = 0 
        else
          @mouvement.cout_etp = (params["addquotite#{i}"].to_f * @cout_etp).round(2) #valider le cout etp car programme nouveau pas supp 
        end 
        @mouvement.save
      end
    end 
    @message = "Redéploiement n°" + @mouvement.mouvement_lien.to_s + "ajouté"
    respond_to do |format|      
      format.all { redirect_to historique_path, notice: @message}       
    end 
  end 

  def update 
  end 

  def suppression
    Mouvement.where(mouvement_lien: params[:id]).destroy_all 
    respond_to do |format|
      format.turbo_stream { redirect_to historique_path, notice: "Redéploiement supprimé"  }       
    end 
  end 

  def ajout_mouvements 
  end 

  def import
    Mouvement.import(params[:file])
    respond_to do |format|
        format.turbo_stream {redirect_to root_path} 
    end
  end 
end