require "test_helper"

class ObjectifsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get objectifs_index_url
    assert_response :success
  end
end
