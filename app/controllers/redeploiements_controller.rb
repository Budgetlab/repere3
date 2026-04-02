class RedeploiementsController < ApplicationController
  before_action :authenticate_user!

  def index
    @annee_a_afficher = (2023..Date.today.year).include?(params[:annee].to_i) ? params[:annee].to_i : @annee
    set_objectifs(@annee_a_afficher)
    set_redeploiements(@annee_a_afficher)
    @pagy, @redeploiements = pagy(@redeploiements_all)
    # Récupérer les mouvements liés à tous les redéploiements
    @mouvements = Mouvement.where(redeploiement_id: @redeploiements_all.select(:id))
    compute_totaux(@mouvements, @objectifs)
    respond_to do |format|
      format.html
      format.xlsx {
        # Définir le nom du fichier XLSX
        filename = "historique_repere3_#{@annee_a_afficher}.xlsx"

        # Générer le fichier XLSX et l'envoyer avec le nom personnalisé
        render xlsx: 'index', filename: filename
      }
    end
  end

  def destroy
    Redeploiement.find(params[:id]).destroy
    respond_to do |format|
      format.turbo_stream { redirect_to redeploiements_path, notice: 'Redéploiement supprimé' }
    end
  end
end
