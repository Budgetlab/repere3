class MouvementsController < ApplicationController
  before_action :authenticate_user!
  before_action :redirect_unless_cbr, only: [:new, :create]
  protect_from_forgery with: :null_session

  def index
    @annee_a_afficher = (2023..Date.today.year).include?(params[:annee].to_i) ? params[:annee].to_i : @annee
    set_objectifs(@annee_a_afficher)
    set_mouvements(@annee_a_afficher)
    @pagy, @mouvements = pagy(@mouvements_all)
    compute_totaux(@mouvements_all, @objectifs)
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
    fin_annee = DateTime.new(Date.today.year, 12, 31)

    (0..9).each do |i|
      next if @suppressions[i].blank?

      programme = Programme.find_by(numero: params[:programmes][i].to_i)
      next unless programme

      @cout_etp = Cout.find_by('programme_id = ? AND categorie = ?', programme.id, params[:grades][i])&.cout.to_f
      date_saisie = Date.strptime(params[:dates][i], '%d/%m/%Y')
      quotite = params[:quotites][i].to_f
      @cout_supp_base += -(quotite * @cout_etp).to_i
      @cout_supp_gestion += -(quotite * @cout_etp * (fin_annee - date_saisie + 1).to_i / 365).to_i
    end

    (0..3).each do |i|
      next if @ajouts[i].blank?

      programme = Programme.find_by(numero: params[:addprogrammes][i].to_i)
      next unless programme

      @cout_etp = Cout.find_by('programme_id = ? AND categorie = ?', programme.id, params[:addgrades][i])&.cout.to_f
      date_saisie = Date.strptime(params[:adddates][i], '%d/%m/%Y')
      quotite = params[:addquotites][i].to_f
      @cout_add_gestion += (quotite * @cout_etp * (fin_annee - date_saisie + 1).to_i / 365).to_i
      @cout_add_base += (quotite * @cout_etp).to_i
    end

    if params[:ponctuel].to_s == 'true'
      @cout_add_base = 0
      @cout_supp_base = 0
    end
    response = {cout_supp_base: @cout_supp_base, cout_supp_gestion: @cout_supp_gestion, cout_add_base: @cout_add_base,
cout_add_gestion: @cout_add_gestion}
    render json: response
  end

  def create
    @redeploiement = Redeploiement.create!(region_id: current_user.region_id, suppression: 0, ajout: 0, cout_etp: 0, credits_gestion: 0)

    ponctuel = params['ponctuel'] == 'true'

    (1..10).each do |i|
      next if params["grade#{i}"].blank?

      date_saisie   = Date.strptime(params["date#{i}"], '%d/%m/%Y')
      programme     = Programme.find_by(numero: params["programme#{i}"].to_i)
      next unless programme

      service       = Service.find_by(nom: params["service#{i}"], programme_id: programme.id)
      cout_unitaire = Cout.find_by('programme_id = ? AND categorie = ?', programme.id, params["grade#{i}"])&.cout.to_f
      quotite       = params["quotite#{i}"].to_f
      fin_annee     = Date.new(Date.today.year, 12, 31)
      debut_annee   = Date.new(Date.today.year, 1, 1)
      jours_restants = (fin_annee + 1 - date_saisie).to_i

      @mouvement = Mouvement.new(
        date: Date.today, type_mouvement: 'suppression',
        user_id: current_user.id, region_id: current_user.region_id,
        quotite: quotite, grade: params["grade#{i}"],
        date_effet: date_saisie,
        programme_id: programme.id, service_id: service&.id,
        mouvement_lien: @redeploiement.id, redeploiement: @redeploiement,
        ponctuel: ponctuel,
        cout_etp: ponctuel ? 0 : -(quotite * cout_unitaire).round,
        credits_gestion: -(quotite * cout_unitaire * jours_restants / 365).round,
        etpt: (quotite * (date_saisie - debut_annee).to_i / 365).round(2)
      )
      @mouvement.save
    end

    (1..4).each do |i|
      next if params["addgrade#{i}"].blank?

      date_saisie    = Date.strptime(params["adddate#{i}"], '%d/%m/%Y')
      programme      = Programme.find_by(numero: params["addprogramme#{i}"].to_i)
      next unless programme

      service        = Service.find_by(nom: params["addservice#{i}"], programme_id: programme.id)
      cout_unitaire  = Cout.find_by('programme_id = ? AND categorie = ?', programme.id, params["addgrade#{i}"])&.cout.to_f
      quotite        = params["addquotite#{i}"].to_f
      fin_annee      = Date.new(Date.today.year, 12, 31)
      jours_restants = (fin_annee + 1 - date_saisie).to_i

      @mouvement = Mouvement.new(
        date: Date.today, type_mouvement: 'ajout',
        user_id: current_user.id, region_id: current_user.region_id,
        quotite: quotite, grade: params["addgrade#{i}"],
        date_effet: date_saisie,
        programme_id: programme.id, service_id: service&.id,
        mouvement_lien: @redeploiement.id, redeploiement: @redeploiement,
        ponctuel: ponctuel,
        cout_etp: ponctuel ? 0 : (quotite * cout_unitaire).round,
        credits_gestion: (quotite * cout_unitaire * jours_restants / 365).round,
        etpt: (quotite * jours_restants / 365).round
      )
      @mouvement.save
    end

    @redeploiement.recalculer_totaux
    @message = "Redéploiement n°#{@redeploiement.id} ajouté"
    respond_to do |format|
      format.all { redirect_to redeploiements_path, notice: @message}
    end
  end

  def update; end
end
