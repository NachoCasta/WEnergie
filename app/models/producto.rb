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
			if !nombre
				nombre = ""
			end
			if !descripcion
				descripcion = ""
			end
			nombre = nombre.gsub("|||", '"')
			descripcion = descripcion.gsub("|||", '"')
			Producto.create(articulo: row["Artikel"], precio: row["Netto"].gsub(".", "").gsub(",", "."), id_interna: row["id"], nombre: nombre, descripcion: descripcion)
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
