require 'test_helper'

class ApisControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get apis_index_url
    assert_response :success
  end

  test "should get form_cotizacion" do
    get apis_form_cotizacion_url
    assert_response :success
  end

  test "should get cotizacion" do
    get apis_cotizacion_url
    assert_response :success
  end

end
