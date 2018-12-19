class Api::V1::UsersController < ApplicationController

  before_action :require_logout, only: [:create]

  def create
    user = User.new(user_params)

    unless user.save
      render json: user.errors, status: 422 and return
    end

    auto_login(user)
    render json: user.as_json, status: 200
  end

  private

  def user_params
    params.permit(:name, :email, :password, :password_confirmation)
  end
end
