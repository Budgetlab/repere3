Rails.application.routes.draw do
  scope(:path => '/repere3') do
    devise_for :admin_users, ActiveAdmin::Devise.config
    ActiveAdmin.routes(self)
    devise_for :users, :path => "",
      :path_names =>  {:sign_in => "connexion", :sign_out => "logout"},
      controllers: {sessions: 'sessions'}
    root 'pages#accueil'
    get 'utilisateurs' => "users#index"
    post 'import_users' => "users#import"
    get 'regions' => "regions#index"
    get 'programmes' => "programmes#index"
    post 'import_programmes' => "programmes#import"
    get 'services' => "services#index"
    post 'import_services' => "services#import"
    post '/select_services' => 'services#select_services'
    get 'couts' => "couts#index"
    post 'import_couts' => "couts#import"
    get '/couts-etp' => "couts#couts"
    get 'objectifs' => "objectifs#index"
    post 'import_objectifs' => "objectifs#import"
    resources :mouvements, only: [:create, :update]
    resources :redeploiements
    get 'ajout-mouvements' => "mouvements#ajout_mouvements"
    post 'import_mouvements' => "mouvements#import"
    get 'historique' => "mouvements#index"
    get 'nouveau-redeploiement' => "mouvements#new"
    post 'get_couts' => "mouvements#get_couts"
    get '/mentions-legales', to: 'pages#mentions_legales'
    get '/donnees-personnelles', to: 'pages#donnees_personnelles'
    get '/accessibilite', to: 'pages#accessibilite'
    get '/plan-du-site', to: 'pages#plan'
    get '/faq', to: 'pages#faq'
    get '/*path', to: 'pages#error_404'
    get '/page_introuvable', to: 'pages#error_404'
    match "/404", to: 'pages#error_404', via: :all
    match "/500", to: 'pages#error_500', via: :all
    get "/422", to: 'pages#error_404'
  end
  get '/', to: redirect('/repere3')
  get '/500', to: redirect('/repere3/500')
  get '/*path', to: redirect('/repere3')
  
end
