class RedeploiementsController < ApplicationController
  before_action :authenticate_user!

  def index
    @annee_a_afficher = [2023, 2024, 2025].include?(params[:annee].to_i) ? params[:annee].to_i : @annee
    date_debut = Date.new(@annee_a_afficher, 1, 1)
    date_fin = Date.new(@annee_a_afficher, 12, 31)
    # Déterminer les regions_id selon le statut de l'utilisateur
    @regions_id = current_user.statut == 'CBR' || current_user.statut == 'prefet' ? current_user.region_id : Region.all.pluck(:id).uniq
    # Récupérer les objectifs pour l'année et les régions
    @objectifs = Objectif.where(date: date_debut..date_fin, region_id: @regions_id)
    # Récupérer les redéploiements associés à l'année et aux régions
    @redeploiements_all = Redeploiement.where(created_at: date_debut..date_fin, region_id: @regions_id).includes(:mouvements, :region).order(created_at: :desc)
    # Paginer les redéploiements
    @pagy, @redeploiements = pagy(@redeploiements_all)
    # Récupérer les IDs des redéploiements déjà chargés
    redeploiements_ids = @redeploiements_all.pluck(:id)
    # Récupérer les mouvements liés aux redéploiements
    @mouvements = Mouvement.where(redeploiement_id: redeploiements_ids)
    # Calcul des totaux
    @credits_gestion = @redeploiements_all.sum(:credits_gestion).to_i
    @cout_etp = @redeploiements_all.sum(:cout_etp).to_i
    @etp_cible = @objectifs.sum(:etp_cible)
    @etp_supp = @mouvements.suppressions.sum(:quotite)
    respond_to do |format|
      format.html
      format.xlsx {
        # Définir le nom du fichier XLSX
        filename = "historique_repere3_#{@annee}.xlsx"

        # Générer le fichier XLSX et l'envoyer avec le nom personnalisé
        render xlsx: 'index', filename: filename
      }
    end
  end

  def destroy
    Redeploiement.where(id: params[:id]).destroy_all
    # Mouvement.where(mouvement_lien: params[:id]).destroy_all
    respond_to do |format|
      format.turbo_stream { redirect_to redeploiements_path, notice: 'Redéploiement supprimé' }
    end
  end
end
