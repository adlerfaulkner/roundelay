class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def require_logout
    if logged_in?
      redirect_to '/', flash: { error: 'You must be logged out to access that page.' }
    end
  end

  def require_login
    if !logged_in?
      redirect_to '/', flash: { error: 'You must be logged in to access that page.' }
    end
  end
end
