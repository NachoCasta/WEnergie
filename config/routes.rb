Rails.application.routes.draw do
  resources :productos
  resources :repuestos

  get 'apis' => "apis#index"
  get 'apis/form_cotizacion_repuestos'
  post 'apis/cotizacion_repuestos'
  get 'apis/form_cotizacion_productos'
  post 'apis/cotizacion_productos'
  get "/productos/articulo/:articulo" => "productos#show_by_articulo"
  get "/repuestos/articulo/:articulo" => "repuestos#show_by_articulo"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
