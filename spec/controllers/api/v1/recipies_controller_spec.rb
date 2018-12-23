require 'rails_helper'

RSpec.describe Api::V1::recipesController, type: :controller do
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

  describe "PATCH :update" do
    before :each do
      @recipe = FactoryGirl.create(:recipe)
      @user = @recipe.writer
    end
    context "when logged out" do
      it 'redirects' do
        patch :update, params: { id: @recipe.id }
        expect(response.status).to eq(302)
      end
    end
    context "invalid recipe id" do
      it "returns errors" do
        login_user
        patch :update, params: { id: @recipe.id + 1 }
        expect(response.status).to eq(422)
      end
    end
    context "without permissions" do
      it "returns errors" do
        @user = FactoryGirl.create(:user)
        login_user
        patch :update, params: { id: @recipe.id }
        expect(response.status).to eq(403)
      end
    end
    context "invalid params" do
      it "returns errors" do
        login_user
        patch :update, params: { id: @recipe.id, ingredients_attributes: @recipe.ingredients.map{ |i| i.as_json.merge!({ "_destroy" => '1' })} }
        expect(response.status).to eq(422)
      end
      it "does not update the recipe" do
        login_user
        expect {
          patch :update, params: { id: @recipe.id, title: 'foobar', ingredients_attributes: @recipe.ingredients.map{ |i| i.as_json.merge!({ "_destroy" => '1' })} }
        }.to_not change{@recipe.reload.title}
      end
    end
    context "valid permissionss" do
      it "returns no errors" do
        login_user
        patch :update, params: { id: @recipe.id,  }
        expect(response.status).to eq(200)
      end
      it "updates the recipe" do
        @old_title = @recipe.title
        login_user
        expect {
          patch :update, params: { id: @recipe.id, title: 'foobar' }
        }.to change{@recipe.reload.title}.from(@old_title).to('foobar')
      end
    end
  end
end
