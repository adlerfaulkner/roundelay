class Api::V1::SessionsController < ApplicationController

  before_action :require_logout, only: [:create]
  before_action :require_login, only: [:destroy]

  def create
		user = User.find_by( email: params[:email].downcase)
    unless user
      render json: { email: ["We couldn't find a user with that email. Try another one?"] }, status: 404 and return
    end

  	if login(params[:email], params[:password])
      render json: user.as_json, status: 200
		else
		 render json: { password: ["Hmm, looks like you entered an incorrect password."] }, status: 401
		end
	end

  def destroy
    logout
    render json: { success: true, csrf_token: form_authenticity_token }, status: 200
  end
end
