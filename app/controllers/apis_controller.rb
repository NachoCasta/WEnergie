class ApisController < ApplicationController
  def index
  	puts "hola"
  end

  def form_cotizacion
  end

  def cotizacion
    render pdf: params["numero_cotizacion"].to_s.rjust(4, '0') #, disposition: 'attachment'
  end
end
