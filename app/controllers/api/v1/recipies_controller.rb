class Api::V1::RecipiesController < ApplicationController
  before_action :require_login, only: [:create, :update]

  def index
    page = params[:page] ? params[:page].to_i : 1
    recipies = Recipe.page(page).per(50)
    last_page = recipies.last_page?
    render json: { recipes: recipies, last_page: last_page }, status: 200
  end

  def create
    recipe = Recipe.new(recipe_params)
    recipe.writer = current_user

    unless recipe.save
      render json: recipe.errors.full_messages, status: 422 and return
    end

    render json: recipe.to_json, status: 200
  end

  def update

  end

  private

  def recipe_params
    params.permit(:title, :description,
      ingredients_attributes: [ :id, :text, :position, :_destroy ],
      steps_attributes: [ :id, :text, :position, :_destroy ])
  end
end
