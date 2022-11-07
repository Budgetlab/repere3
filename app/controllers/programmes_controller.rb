class ProgrammesController < ApplicationController
	before_action :authenticate_user!
	protect_from_forgery with: :null_session
  	
  	def index
  		@programmes = Programme.all.order(numero: :asc) 
  		if current_user.statut == 'CBR' || current_user.statut == "prefet"
	      @region_id = current_user.region_id
	    else
	      @region_id = Region.all.pluck(:id).uniq
	    end
  		respond_to do |format|
        	format.html
        	format.csv {send_data @programmes.to_csv(@region_id), type: 'text/csv', disposition: 'attachment', filename: "synthese_programme.csv"}
    	end
  	end

  	def import
  		Programme.import(params[:file])
  		respond_to do |format|
		  	format.turbo_stream {redirect_to root_path} 
		end
  	end 

end
