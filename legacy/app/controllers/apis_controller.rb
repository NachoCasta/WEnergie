class ApisController < ApplicationController
  def index
  end

  def form_cotizacion_repuestos
  end

  def cotizacion_repuestos
    render pdf: params["numero_cotizacion"].to_s.rjust(4, '0') #, disposition: 'attachment'
  end

  def form_cotizacion_productos
  end

  def cotizacion_productos
    render pdf: params["numero_cotizacion"].to_s.rjust(4, '0') #, disposition: 'attachment'
  end
end
