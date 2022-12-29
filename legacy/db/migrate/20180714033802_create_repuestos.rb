class CreateRepuestos < ActiveRecord::Migration[5.2]
  def change
    create_table :repuestos do |t|
      t.string :articulo
      t.float :precio
      t.integer :id_interna
      t.string :descripcion

      t.timestamps
    end
  end
end
