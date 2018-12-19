# == Schema Information
#
# Table name: users
#
#  id                              :integer          not null, primary key
#  email                           :string           not null
#  name                            :string
#  username                        :string
#  crypted_password                :string
#  salt                            :string
#  created_at                      :datetime         not null
#  updated_at                      :datetime         not null
#  remember_me_token               :string
#  remember_me_token_expires_at    :datetime
#  reset_password_token            :string
#  reset_password_token_expires_at :datetime
#  reset_password_email_sent_at    :datetime
#

require 'rails_helper'

RSpec.describe Recipe, type: :model do

  describe "Validations" do
    it { should validate_presence_of(:writer) }
    it {should validate_presence_of(:ingredients)}
    it {should validate_presence_of(:steps)}
  end

  describe "Associations" do
    it { should have_many(:ingredients) }
    it { should have_many(:steps) }
    it { should belong_to(:creator) }
    it { should belong_to(:writer) }
  end
end
