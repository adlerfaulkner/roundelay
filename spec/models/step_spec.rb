require 'rails_helper'

RSpec.describe Step, type: :model do
  let(:recipe) { FactoryBot.create(:recipe) }
  subject { recipe.steps.first }

  describe "Validations" do
    it { should validate_presence_of(:recipe) }
    it { should validate_uniqueness_of(:position).scoped_to(:recipe_id) }
  end

  describe "Associations" do
    it { should belong_to(:recipe) }
  end
end
