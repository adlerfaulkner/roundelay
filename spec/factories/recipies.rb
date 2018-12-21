FactoryGirl.define do
  factory :recipe do
    association :writer, factory: :user
    title Faker::Book.title

    before(:create) do |recipe, evaluator|
      recipe.ingredients = build_list(:ingredient, 2, recipe: recipe)
      recipe.steps = build_list(:step, 2, recipe: recipe)
    end
  end
end
