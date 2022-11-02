class ServicesController < ApplicationController
  before_action :authenticate_user!
  protect_from_forgery with: :null_session
    
  def index
  end

  def import
    Service.import(params[:file])
    respond_to do |format|
      format.turbo_stream {redirect_to root_path} 
    end
  end

  def select_services
    if !params[:programme].nil? && params[:programme] != ""
      programme_id = Programme.where(numero: params[:programme].to_i)
      services = Service.where(programme_id: programme_id).order(nom: :asc).pluck(:nom)
    else 
      services = nil 
    end 
    response = {services: services}
    render json: response
  end 
end
