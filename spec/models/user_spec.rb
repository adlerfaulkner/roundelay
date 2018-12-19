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

RSpec.describe User, type: :model do

  describe "Validations" do
    it { should validate_presence_of(:email).with_message("Please enter an email address.") }
    it { should validate_length_of(:email).is_at_most(255) }
    it { should validate_uniqueness_of(:email).with_message("A user with this email already exists.") }
    it { should allow_value('adler@comake.io').for(:email) }
    it { should_not allow_value('adler').for(:email).with_message("Email is invalid.") }
    it { should validate_presence_of(:name).with_message("Please enter your name.") }
    it { should allow_value('adler').for(:name) }
    it { should_not allow_value('adler?').for(:name).with_message("Names can only contain letters, periods, apostrophes, and dashes.") }
    it { should validate_presence_of(:password).with_message("Please enter a password.") }
    it { should validate_length_of(:password).is_at_least(5).is_at_most(72) }
    it { should validate_presence_of(:password_confirmation).with_message("Please repeat the same password.") }
  end

  describe "Associations" do
    it { should have_many(:created_recipies) }
    it { should have_many(:written_recipies) }
  end
end
