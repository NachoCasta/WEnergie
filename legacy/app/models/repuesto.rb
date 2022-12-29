class Repuesto < ApplicationRecord
	require "csv"
	# Antes de importar:
	#  reemplazar "" con |||
	#  eliminar "
	#  reemplazar ||| con ""

	def self.import(file)
		CSV.foreach(file, col_sep: ";", encoding: 'iso-8859-1:utf-8', headers: true, quote_char: '|') do |row|
			if row["Name ES"]
				descripcion = row["Name ES"]
			elsif row["Name EN"]
				descripcion = row["Name EN"]
			else
				descripcion = row["Name DE"]
			end
			if !descripcion or descripcion.nil?
				descripcion = ""
			end
			descripcion = descripcion.gsub("|||", '"')
			precio = row["Netto"].gsub(".", "").gsub(",", ".")
			articulo = row["Artikel"]
			id_interna = row["id"]
			repuesto = Repuesto.find_by(articulo: articulo)
			if repuesto.nil? # No existe
				puts articulo + " no existe"
				Repuesto.create(articulo: articulo, precio: precio, id_interna: id_interna, descripcion: descripcion)
			else
				puts articulo + " si existe."
				if repuesto.precio != precio
					puts "Se cambiará precio de " + repuesto.precio.to_s + " a " + precio.to_s
					repuesto.update(precio: precio)
					puts "Nuevo precio: " + repuesto.precio.to_s
				else
					puts "Precio es igual asi que se mantiene"
				end
			end
		end
	end

	def self.get_repuestos
		repuestos = []
		Repuesto.all.each do |r|
			if r.descripcion == nil
				repuesto = [r.articulo, r.id]
			else
				repuesto = [r.articulo + " - " + r.descripcion, r.id]
			end
			repuestos << repuesto
		end
		return repuestos.sort
	end
end
