require 'rails_helper'

RSpec.describe Api::V1::SessionsController, type: :controller do
  describe "POST #create" do
    before :each do
      @user = FactoryGirl.create(:user)
    end
    context "when logged in" do
      it "redirects" do
        login_user
        post :create, params: { email: @user.email, password:'password' }
        expect(response.status).to eq(302)
      end
    end
    context "invalid email" do
      it "returns errors" do
        post :create, params: { email: "foo" }
        expect(response.status).to eq(404)
      end
    end
    context "invalid password" do
      it "returns errors" do
        post :create, params: { email: @user.email, password: 'foo' }
        expect(response.status).to eq(401)
      end
    end
    context "valid params" do
      it "returns no errors" do
        post :create, params: { email: @user.email, password:'password' }
        expect(response.status).to eq(200)
      end
    end
  end

  describe "POST #create" do
    before :each do
      @user = FactoryGirl.create(:user)
    end
    context "when logged out" do
      it "redirects" do
        delete :destroy
        expect(response.status).to eq(302)
      end
    end
    context "when logged in" do
      it "returns no errors" do
        login_user
        delete :destroy, params: { email: @user.email, password:'password' }
        expect(response.status).to eq(200)
      end
    end
  end
end
