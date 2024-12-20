class MouvementsController < ApplicationController
  before_action :authenticate_user!
  before_action :redirect_unless_cbr, only: [:new, :create]
  protect_from_forgery with: :null_session

  def index
    @annee_a_afficher = [2023, 2024, 2025].include?(params[:annee].to_i) ? params[:annee].to_i : @annee
    date_debut = Date.new(@annee_a_afficher, 1, 1)
    date_fin = Date.new(@annee_a_afficher, 12, 31)
    case current_user.statut
    when 'admin'
      @redeploiements = Redeploiement.includes(:region, mouvements: [:service, :programme]).where(created_at: date_debut..date_fin).order(created_at: :desc)
      @mouvements_array = @redeploiements.pluck(:redeploiement_id, :type_mouvement, 'mouvements.quotite', 'mouvements.cout_etp', 'mouvements.credits_gestion')
      @etp_cible = Objectif.where(date: date_debut..date_fin).sum(:etp_cible)
    when 'prefet', 'CBR'
      @redeploiements = Redeploiement.includes(mouvements: [:service, :programme]).where(region_id: current_user.region_id, created_at: date_debut..date_fin).order(created_at: :desc)
      @mouvements_array = @redeploiements.pluck(:redeploiement_id, :type_mouvement, 'mouvements.quotite', 'mouvements.cout_etp', 'mouvements.credits_gestion')
      @etp_cible = Objectif.where(date: date_debut..date_fin).where(region_id: current_user.region_id).sum(:etp_cible)
    when 'ministere'
      @ministere = Ministere.where(nom: current_user.nom).first
      @programme_id = Programme.where(ministere_id: @ministere.id).pluck(:id)
      @mouvements = Mouvement.includes(:service, :programme).where(programme_id: @programme_id, created_at: date_debut..date_fin).order(created_at: :desc)
      @etp_cible = Objectif.where(date: date_debut..date_fin).where(programme_id: @programme_id).sum(:etp_cible)
      @redeploiements = []
      @mouvements_array = @mouvements.pluck(:id, :type_mouvement, :quotite, :cout_etp, :credits_gestion)
    end
    @etp_supp = @mouvements_array.select { |s| s.include?("suppression")}.sum{ |s| s[2] }.round(1)
    @etp_3 = (0.03 * @etp_cible).round(1)
    @credits_gestion = @mouvements_array.sum{ |s| s[4] }.to_i
    @cout_etp = @mouvements_array.sum{ |s| s[3] }.to_i
    respond_to do |format|
      format.html
      format.xlsx
    end
  end

  def new; end

  def get_couts
    @suppressions = params[:grades]
    @ajouts = params[:addgrades]
    @cout_supp_base = 0
    @cout_supp_gestion = 0
    @cout_add_base = 0
    @cout_add_gestion = 0
    (0..9).to_a.each do |i|
      if !@suppressions[i].nil? && @suppressions[i] != ''
        @cout_etp = Cout.where('programme_id = ? AND categorie = ?',
                               Programme.where(numero: params[:programmes][i].to_i).first.id, params[:grades][i]).first.cout
        @cout_supp_base += -(params[:quotites][i].to_f * @cout_etp).to_i
        @cout_supp_gestion += -(params[:quotites][i].to_f * @cout_etp * (DateTime.new(Date.today.year,12,
                                                                                      31)-params[:dates][i].to_date).to_i / 365).to_i
      end
    end
    (0..3).to_a.each do |i|
      if !@ajouts[i].nil? && @ajouts[i] != ''
        @cout_etp = Cout.where('programme_id = ? AND categorie = ?',
                               Programme.where(numero: params[:addprogrammes][i].to_i).first.id, params[:addgrades][i]).first.cout
        @cout_add_gestion = (params[:addquotites][i].to_f * @cout_etp * (DateTime.new(Date.today.year,12,
                                                                                      31)-params[:adddates][i].to_date).to_i / 365).to_i
        @cout_add_base += (params[:addquotites][i].to_f * @cout_etp).to_i # valider le cout etp car programme nouveau pas supp
      end
    end

    if params[:ponctuel] == true
      @cout_add_base = 0
      @cout_supp_base = 0
    end
    response = {cout_supp_base: @cout_supp_base, cout_supp_gestion: @cout_supp_gestion, cout_add_base: @cout_add_base,
cout_add_gestion: @cout_add_gestion}
    render json: response
  end

  def create
    @redeploiement = Redeploiement.new
    @redeploiement.region_id = current_user.region_id
    @redeploiement.suppression = 0
    @redeploiement.ajout = 0
    @redeploiement.cout_etp = 0
    @redeploiement.credits_gestion = 0
    @redeploiement.save

    @lien = Mouvement.count+1
    @suppressions = [params[:grade1],params[:grade2],params[:grade3],params[:grade4],params[:grade5],params[:grade6],
params[:grade7],params[:grade8],params[:grade9],params[:grade10]]
    @ajouts = [params[:addgrade1],params[:addgrade2],params[:addgrade3],params[:addgrade4]]
    (1..10).to_a.each do |i|
      if !@suppressions[i-1].nil? && @suppressions[i-1] != ''
        @mouvement = Mouvement.new
        @mouvement.date = Date.today
        @mouvement.type_mouvement = 'suppression'
        @mouvement.user_id = current_user.id
        @mouvement.region_id = current_user.region_id
        @mouvement.quotite = params["quotite#{i}"].to_f
        @mouvement.grade = params["grade#{i}"]
        @mouvement.date_effet = params["date#{i}"].to_date + 1.day
        @mouvement.programme_id = Programme.where(numero: params["programme#{i}"].to_i).first.id
        @mouvement.service_id = Service.where(nom: params["service#{i}"],
                                              programme_id: Programme.where(numero: params["programme#{i}"].to_i).first.id).first.id
        @cout_etp = Cout.where('programme_id = ? AND categorie = ?',
                               Programme.where(numero: params["programme#{i}"].to_i).first.id, params["grade#{i}"]).first.cout
        if params['ponctuel'] == 'true'
          @mouvement.ponctuel = true
          @mouvement.cout_etp = 0
        else
          @mouvement.cout_etp = -(params["quotite#{i}"].to_f * @cout_etp).round(2)
        end
        @mouvement.credits_gestion = -(params["quotite#{i}"].to_f * @cout_etp * (DateTime.new(Date.today.year,12,
                                                                                              31)-params["date#{i}"].to_date).to_i / 365).round(2)
        @mouvement.etpt =  (params["quotite#{i}"].to_f * (params["date#{i}"].to_date-DateTime.new(Date.today.year,1,
                                                                                                  1)).to_i / 365).round(2)
        @mouvement.mouvement_lien = @redeploiement.id
        @mouvement.redeploiement = @redeploiement
        @mouvement.save
        @redeploiement.suppression += 1
        @redeploiement.cout_etp += @mouvement.cout_etp
        @redeploiement.credits_gestion += @mouvement.credits_gestion
      end
    end
    (1..4).to_a.each do |i|
      if !@ajouts[i-1].nil? && @ajouts[i-1] != ''
        @mouvement = Mouvement.new
        @mouvement.date = Date.today
        @mouvement.type_mouvement = 'ajout'
        @mouvement.user_id = current_user.id
        @mouvement.region_id = current_user.region_id
        @mouvement.quotite = params["addquotite#{i}"].to_f
        @mouvement.grade = params["addgrade#{i}"]
        @mouvement.date_effet = params["adddate#{i}"].to_date + 1.day
        @mouvement.programme_id = Programme.where(numero: params["addprogramme#{i}"].to_i).first.id
        @mouvement.service_id = Service.where(nom: params["addservice#{i}"],
                                              programme_id: Programme.where(numero: params["addprogramme#{i}"].to_i).first.id).first.id
        @cout_etp = Cout.where('programme_id = ? AND categorie = ?',
                               Programme.where(numero: params["addprogramme#{i}"].to_i).first.id, params["addgrade#{i}"]).first.cout
        @mouvement.credits_gestion = (params["addquotite#{i}"].to_f * @cout_etp * (DateTime.new(Date.today.year,12,
                                                                                                31)-params["adddate#{i}"].to_date).to_i / 365).round(2)
        @mouvement.etpt =  (params["addquotite#{i}"].to_f * (DateTime.new(Date.today.year,12,
                                                                          31)-params["adddate#{i}"].to_date ).to_i / 365).round(2)
        @mouvement.mouvement_lien = @redeploiement.id
        @mouvement.redeploiement = @redeploiement
        if params['ponctuel'] == 'true'
          @mouvement.ponctuel = true
          @mouvement.cout_etp = 0
        else
          @mouvement.cout_etp = (params["addquotite#{i}"].to_f * @cout_etp).round(2) # valider le cout etp car programme nouveau pas supp
        end
        @mouvement.save
        @redeploiement.ajout += 1
        @redeploiement.cout_etp += @mouvement.cout_etp
        @redeploiement.credits_gestion += @mouvement.credits_gestion
      end
    end

    @redeploiement.save
    @message = 'Redéploiement n°' + @mouvement.mouvement_lien.to_s + ' ajouté'
    respond_to do |format|
      format.all { redirect_to historique_path, notice: @message}
    end
  end

  def update; end

  def suppression
    Redeploiement.where(id: params[:id]).destroy_all
    # Mouvement.where(mouvement_lien: params[:id]).destroy_all
    respond_to do |format|
      format.turbo_stream { redirect_to historique_path, notice: 'Redéploiement supprimé' }
    end
  end

  def ajout_mouvements; end

  def import
    Mouvement.import(params[:file])
    respond_to do |format|
      format.turbo_stream { redirect_to root_path}
    end
  end

  private
  def redirect_unless_cbr
    redirect_to root_path unless current_user.statut == 'CBR'
  end
end
