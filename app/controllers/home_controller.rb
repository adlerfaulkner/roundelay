class HomeController < ApplicationController
  def index
    @user = current_user&.as_json
  end
end
