require 'rails_helper'

RSpec.describe Api::V1::UsersController, type: :controller do
  describe "POST #create" do
    context "invalid params" do
      it "returns errors" do
        post :create, params: { name: "Adler" }
        expect(response.status).to eq(422)
      end
      it "does not create a user" do
        expect {
          post :create, params: { name: "Adler" }
        }.to_not change(User, :count)
      end
    end
    context "valid params" do
      it "returns no errors" do
        post :create, params: {
          name: "Adler",
          email: 'adler@comake.io',
          password: 'abc123',
          password_confirmation: 'abc123'
        }
        expect(response.status).to eq(200)
      end
      it "creates a user" do
        expect {
          post :create, params: {
            name: "Adler",
            email: 'adler@comake.io',
            password: 'abc123',
            password_confirmation: 'abc123'
          }
        }.to change(User, :count).by(1)
      end
    end
  end
end
