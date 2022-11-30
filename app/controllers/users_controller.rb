class UsersController < ApplicationController
	before_action :authenticate_user!
	
	protect_from_forgery with: :null_session
	def index
		if current_user.statut != "admin"
			redirect_to root_path
		end 
	end 
	def import
		User.import(params[:file])
    	respond_to do |format|
		  	format.turbo_stream {redirect_to root_path} 
		end
	end

end
