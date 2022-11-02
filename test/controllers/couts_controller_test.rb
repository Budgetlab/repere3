require "test_helper"

class CoutsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get couts_index_url
    assert_response :success
  end
end
