class Producto < ApplicationRecord
	require "csv"

	def self.import(file)
		CSV.foreach(file, col_sep: ";", encoding: 'iso-8859-1:utf-8', headers: true, quote_char: '"') do |row|
			if row["Name ES"]
				nombre = row["Name ES"]
				descripcion = row["Text ES"]
			elsif row["Name EN"]
				nombre = row["Name EN"]
				descripcion = row["Text EN"]
			else
				nombre = row["Name DE"]
				descripcion = row["Text DE"]
			end
			if !nombre or nombre.nil?
				nombre = ""
			end
			if !descripcion or descripcion.nil?
				descripcion = ""
			end
			nombre = nombre.gsub("|||", '"')
			descripcion = descripcion.gsub("|||", '"')
			precio = row["Netto"].gsub(".", "").gsub(",", ".")
			articulo = row["Artikel"]
			id_interna = row["id"]
			producto = Producto.find_by(articulo: articulo)
			if producto.nil? # No existe
				Producto.create(articulo: articulo, precio: precio, id_interna: id_interna, nombre: nombre, descripcion: descripcion)
				puts articulo + " no existe"
			else
				puts articulo + " si existe."
				if producto.precio != precio
					puts "Se cambiará precio de " + producto.precio.to_s + " a " + precio.to_s
					producto.update(precio: precio)
					puts "Nuevo precio: " + producto.precio.to_s
				else
					puts "Precio es igual asi que se mantiene"
				end
			end
		end
	end

	def self.get_productos
		productos = []
		Producto.all.each do |p|
			if p.nombre == nil
				producto = [p.articulo, p.id]
			else
				producto = [p.articulo + " - " + p.nombre, p.id]
			end
			productos << producto
		end
		return productos.sort
	end
end
