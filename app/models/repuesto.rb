class Repuesto < ApplicationRecord
	require "csv"

	def self.import(file)
		CSV.foreach(file, col_sep: ";", encoding: 'iso-8859-1:utf-8', headers: true, quote_char: "|") do |row|
			Repuesto.create(articulo: row["Artikel"], precio: row["Netto"].gsub(".", "").gsub(",", "."), id_interna: row["id"], descripcion: row["Name ES"])
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
		return repuestos
	end
end
