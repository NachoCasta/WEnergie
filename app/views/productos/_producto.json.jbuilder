json.extract! producto, :id, :articulo, :precio, :id_interna, :nombre, :descripcion, :created_at, :updated_at
json.url producto_url(producto, format: :json)
