require 'rails_helper'

RSpec.describe Step, type: :model do

  describe "Validations" do
    it { should validate_presence_of(:recipe) }
  end

  describe "Associations" do
    it { should belong_to(:recipe) }
  end
end
