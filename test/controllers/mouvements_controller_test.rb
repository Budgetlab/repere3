require "test_helper"

class MouvementsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get mouvements_index_url
    assert_response :success
  end
end
