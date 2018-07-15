Rails.application.routes.draw do
  resources :repuestos

  get 'apis/' => "apis#index"
  get 'apis/form_cotizacion'
  get 'apis/cotizacion'
  post 'apis/cotizacion' => "apis#cotizacion"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
