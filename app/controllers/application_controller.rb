class ApplicationController < ActionController::Base
  #include Pagy::Backend
  include Pagy::Method
  protect_from_forgery with: :exception
  rescue_from ActiveRecord::RecordNotFound do
    flash[:warning] = 'Resource not found.'
    redirect_back_or root_path
  end
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_global_variable

  def redirect_back_or(path)
    redirect_to request.referer || path
  end
  helper_method :resource_name, :resource, :devise_mapping, :resource_class
  def resource_name
    :user
  end

  def resource
    @resource ||= User.new
   end
  def resource_class
    User
  end

  def devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
  end

    protected
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:email, :statut, :region_id, :nom, :password, :password_confirmation])
    devise_parameter_sanitizer.permit(:sign_in, keys: [:statut, :region_id, :password, :nom])
    devise_parameter_sanitizer.permit(:account_update, keys: [:email, :password, :password_confirmation,:region_id, :statut, :nom ])
  end

    private
  def require_admin
    redirect_to root_path unless current_user.statut == 'admin'
  end

  def redirect_unless_cbr
    redirect_to root_path unless current_user.statut == 'CBR'
  end

  def set_redeploiements(annee)
    date_debut = Date.new(annee, 1, 1)
    date_fin = Date.new(annee, 12, 31)
    @redeploiements_all = case current_user.statut
                          when 'CBR', 'prefet'
                            Redeploiement.where(created_at: date_debut..date_fin, region_id: current_user.region_id)
                          when 'ministere'
                            ministere = Ministere.find_by(nom: current_user.nom)
                            programmes_id = Programme.where(ministere_id: ministere&.id).pluck(:id)
                            redeploiement_ids = Mouvement.where(programme_id: programmes_id, created_at: date_debut..date_fin)
                                                         .select(:redeploiement_id)
                            Redeploiement.where(id: redeploiement_ids)
                          else
                            Redeploiement.where(created_at: date_debut..date_fin)
                          end.includes(:mouvements, :region).order(created_at: :desc)
  end

  def set_objectifs(annee)
    year = Date.new(annee, 1, 1)
    @objectifs = case current_user.statut
                 when 'CBR', 'prefet'
                   Objectif.where(date: year, region_id: current_user.region_id)
                 when 'ministere'
                   ministere = Ministere.find_by(nom: current_user.nom)
                   programmes_id = Programme.where(ministere_id: ministere&.id).pluck(:id)
                   Objectif.where(date: year, programme_id: programmes_id)
                 else
                   Objectif.where(date: year)
                 end
  end

  def set_mouvements(annee)
    date_debut = Date.new(annee, 1, 1)
    date_fin   = Date.new(annee, 12, 31)
    @mouvements_all = case current_user.statut
                      when 'CBR', 'prefet'
                        Mouvement.where(region_id: current_user.region_id, created_at: date_debut..date_fin)
                      when 'ministere'
                        ministere = Ministere.find_by(nom: current_user.nom)
                        programmes_id = Programme.where(ministere_id: ministere&.id).pluck(:id)
                        Mouvement.where(programme_id: programmes_id, created_at: date_debut..date_fin)
                      else
                        Mouvement.where(created_at: date_debut..date_fin)
                      end.includes(:service, :programme).order(created_at: :desc)
  end

  def set_regions
    @regions = if ['CBR', 'prefet'].include?(current_user.statut)
                 Region.where(id: current_user.region_id)
               else
                 Region.all.order(nom: :asc)
               end
  end

  def set_programmes
    @programmes = if current_user.statut == 'ministere'
                    ministere = Ministere.find_by(nom: current_user.nom)
                    Programme.where(ministere_id: ministere&.id).order(numero: :asc)
                  else
                    Programme.all.order(numero: :asc)
                  end
  end

  def compute_totaux(mouvements, objectifs)
    @credits_gestion = mouvements.sum(:credits_gestion).to_i
    @cout_etp        = mouvements.sum(:cout_etp).to_i
    @etp_cible       = objectifs.sum(:etp_cible)
    @etp_supp        = mouvements.suppressions.sum(:quotite)
  end

  def compute_totaux_accueil(mouvements, objectifs)
    @etp_cible = objectifs.sum(:etp_cible)
    @etp_redeployables = (0.03 * @etp_cible).round(1)
    @etp_supp = mouvements.suppressions.sum(:quotite)
  end

  # fonction pour déclarer les variables globales dans l'application
  def set_global_variable
    @annee = Date.today.year
  end
end
