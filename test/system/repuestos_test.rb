require "application_system_test_case"

class RepuestosTest < ApplicationSystemTestCase
  setup do
    @repuesto = repuestos(:one)
  end

  test "visiting the index" do
    visit repuestos_url
    assert_selector "h1", text: "Repuestos"
  end

  test "creating a Repuesto" do
    visit repuestos_url
    click_on "New Repuesto"

    fill_in "Articulo", with: @repuesto.articulo
    fill_in "Descripcion", with: @repuesto.descripcion
    fill_in "Id Interna", with: @repuesto.id_interna
    fill_in "Precio", with: @repuesto.precio
    click_on "Create Repuesto"

    assert_text "Repuesto was successfully created"
    click_on "Back"
  end

  test "updating a Repuesto" do
    visit repuestos_url
    click_on "Edit", match: :first

    fill_in "Articulo", with: @repuesto.articulo
    fill_in "Descripcion", with: @repuesto.descripcion
    fill_in "Id Interna", with: @repuesto.id_interna
    fill_in "Precio", with: @repuesto.precio
    click_on "Update Repuesto"

    assert_text "Repuesto was successfully updated"
    click_on "Back"
  end

  test "destroying a Repuesto" do
    visit repuestos_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Repuesto was successfully destroyed"
  end
end
