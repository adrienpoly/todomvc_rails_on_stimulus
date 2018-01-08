class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  private

  def session_user
    @session_user ||= session[:user_id] || generate_session_user_id
    # @session_user = session[:user_id]
  end

  def generate_session_user_id
    session[:user_id] = SecureRandom.hex
  end
end
