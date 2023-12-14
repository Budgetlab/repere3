class ApplicationController < ActionController::Base
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
    unless current_user.statut == 'admin'
      redirect_to root_path
    end
  end

  # fonction pour déclarer les variables globales dans l'application
  def set_global_variable
    @annee = Date.today.year
  end

end
