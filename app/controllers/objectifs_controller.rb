# frozen_string_literal: true

# Controller Objectifs
class ObjectifsController < ApplicationController
  before_action :authenticate_user!
  protect_from_forgery with: :null_session
  before_action :require_admin

  # Page pour importer les objectifs
  def index
    # Par exemple dans un modèle ou un rake task
    Mouvement.find_each do |mouvement|
      mouvement.update(
        cout_etp: mouvement.cout_etp.round,
        credits_gestion: mouvement.credits_gestion.round
      )
    end
  end

  def import
    Objectif.import(params[:file])
    respond_to do |format|
      format.turbo_stream { redirect_to objectifs_path }
    end
  end
end
