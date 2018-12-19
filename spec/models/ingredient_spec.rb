require 'rails_helper'

RSpec.describe Ingredient, type: :model do
  let(:recipe) { FactoryGirl.create(:recipe) }
  subject { recipe.ingredients.first }

  describe "Validations" do
    it { should validate_presence_of(:recipe) }
    it { should validate_uniqueness_of(:position).scoped_to(:recipe_id) }
  end

  describe "Associations" do
    it { should belong_to(:recipe) }
  end
end
