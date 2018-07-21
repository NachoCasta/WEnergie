Rails.application.routes.draw do
  resources :productos
  resources :repuestos

  get 'apis' => "apis#index"
  get 'apis/form_cotizacion_repuestos'
  post 'apis/cotizacion_repuestos'
  get 'apis/form_cotizacion_productos'
  post 'apis/cotizacion_productos'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
