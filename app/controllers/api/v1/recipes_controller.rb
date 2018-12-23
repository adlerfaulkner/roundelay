class Api::V1::RecipesController < ApplicationController
  before_action :require_login, only: [:create, :update]

  def index
    page = params[:page] ? params[:page].to_i : 1

    if params[:q].blank?
      recipes = Recipe.published.page(page).per(50)
    else
      search = Recipe.search do
        fulltext params[:q].downcase
        paginate page: page, per_page: 50
      end
      recipes = search.results
    end
    last_page = recipes.last_page?
    render json: { recipes: recipes.map(&:to_json), last_page: last_page }, status: 200
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
    recipe = Recipe.find_by(id: params[:id])

    unless recipe
      render json: { error: "Invalid recipe." }, status: 422 and return
    end

    unless recipe.can_edit?(current_user.id)
      render json: { error: "Permission denied." }, status: 403 and return
    end

    ingredients_to_delete = Ingredient.where(id: params[:ingredients_to_delete])
    if ingredients_to_delete.any?
      recipe.ingredients.delete(ingredients_to_delete)
    end

    steps_to_delete = Step.where(id: params[:steps_to_delete])
    if steps_to_delete.any?
      recipe.steps.delete(steps_to_delete)
    end

    unless recipe.update(edit_recipe_params)
      render json: recipe.errors.full_messages, status: 422 and return
    end

    render json: recipe.to_json, status: 200
  end

  private

  def recipe_params
    params.require(:recipe).permit(:title, :description,
      ingredients_attributes: [ :id, :text, :position, :_destroy ],
      steps_attributes: [ :id, :text, :position, :_destroy ])
  end
  def edit_recipe_params
    params.require(:recipe).permit(:id, :title, :description,
      ingredients_attributes: [ :id, :text, :position ],
      steps_attributes: [ :id, :text, :position ])
  end
end
