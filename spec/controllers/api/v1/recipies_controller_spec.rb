require 'rails_helper'

RSpec.describe Api::V1::RecipiesController, type: :controller do
  describe "GET #index" do
    it "always returns no errors" do
      get :index
      expect(response.status).to eq(200)
    end
  end

  describe "POST #create" do
    before :each do
      @user = FactoryGirl.create(:user)
    end
    context "when logged out" do
      it 'redirects' do
        post :create
        expect(response.status).to eq(302)
      end
    end
    context "invalid params" do
      it "returns errors" do
        login_user
        post :create, params: { title: 'banana', ingredients_attributes: [], steps_attributes: [] }
        expect(response.status).to eq(422)
      end
      it "does not create a recipe" do
        login_user
        expect {
          post :create, params: { title: 'banana', ingredients_attributes: [], steps_attributes: [] }
        }.to_not change(Recipe, :count)
      end
    end
    context "valid params" do
      it "returns no errors" do
        login_user
        post :create, params: { title: 'banana', ingredients_attributes: [{ text: 'alphabet', position: 0 }], steps_attributes: [{ text: 'alphabet', position: 0 }] }
        expect(response.status).to eq(200)
      end
      it "creates a recipe" do
        login_user
        expect {
          post :create, params: { title: 'banana', ingredients_attributes: [{ text: 'alphabet', position: 0 }], steps_attributes: [{ text: 'alphabet', position: 0 }] }
        }.to change(Recipe, :count).by(1)
      end
    end
  end
end
