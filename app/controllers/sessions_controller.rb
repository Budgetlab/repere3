class SessionsController < Devise::SessionsController
  
  def create
	  if params[:user][:statut] == "admin"
     resource = User.find_for_database_authentication(statut: params[:user][:statut])
    elsif params[:user][:statut] == "CBR" || params[:user][:statut] == "prefet"
      resource = User.find_for_database_authentication(statut: params[:user][:statut],region_id: params[:user][:region_id].to_i)
    elsif params[:user][:statut] == "ministere"
      resource = User.find_for_database_authentication(statut: params[:user][:statut],nom: params[:user][:nom])
    end

	  return invalid_login_attempt unless resource

	  if resource.valid_password?(params[:user][:password])
	    self.resource = warden.authenticate!(auth_options)
	    #set_flash_message!(:notice, :signed_in)
	    sign_in(resource_name, resource)
     
	    yield resource if block_given?
	    #respond_with resource, location: after_sign_in_path_for(resource)
      respond_to do |format|
        format.turbo_stream {redirect_to root_path} 
      end 

	  else 
		  invalid_login_attempt     
	  end
  
  end

  def destroy
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
    #set_flash_message! :notice, :signed_out if signed_out
    yield if block_given?
    #respond_to_on_destroy
    respond_to do |format|
      format.all { redirect_to root_path }
    end
  end
 
  def after_sign_in_path_for(resource)
    respond_to do |format|
        format.turbo_stream {redirect_to root_path} 
    end   
  end

  protected
  def invalid_login_attempt
    render json: flash[:alert], status: 401
  end


end