class Api::V1::UsersController < ApplicationController

  before_action :require_logout, only: [:create]

  def create
    user = User.new(
      name: params[:name],
      email: params[:email],
      password: params[:password],
      password_confirmation: params[:password_confirmation]
    )
    unless user.save
      render json: user.errors, status: 422 and return
    end

    auto_login(user)
    render json: user.as_json, status: 200
  end
end
