require 'rails_helper'

RSpec.describe Ingredient, type: :model do

  describe "Validations" do
    it { should validate_presence_of(:recipe) }
  end

  describe "Associations" do
    it { should belong_to(:recipe) }
  end
end
