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

class User < ApplicationRecord
  include Elasticsearch::Model
  include Elasticsearch::Model::Callbacks

  authenticates_with_sorcery!

  has_many :created_recipes, class_name: 'Recipe', foreign_key: :creator_id
  has_many :written_recipes, class_name: 'Recipe', foreign_key: :creator_id

  after_update { self.written_recipes.each(&:touch) }

  VALID_EMAIL_REGEX = /@/i
  validates :email,
    length: { maximum: 255 },
  	format: { with: VALID_EMAIL_REGEX, message: "Email is invalid." },
  	uniqueness: { message: "A user with this email already exists." },
  	presence: { message: "Please enter an email address."}
  validates	:name,
    format: {
      with: /\A[A-Za-z '.-]*[A-Za-z'.-][A-Za-z '.-]*\z/i,
      message: "Names can only contain letters, periods, apostrophes, and dashes."
    },
    length: { maximum: 72 },
    presence: { message: "Please enter your name."}
  validates :password,
    length: {minimum: 5, maximum: 72 },
    presence: { message: "Please enter a password."},
    confirmation: true
  validates :password_confirmation,
    presence: { message: "Please repeat the same password."}

  before_create :set_username

  settings index: { number_of_shards: 1 } do
    mappings dynamic: 'false' do
      indexes :name, type: :text, analyzer: :english
    end
  end

  def as_indexed_json(options={})
    { name: name }
  end

  def as_json(*)
    super.except("updated_at", "created_at", "salt",
      "crypted_password", "remember_me_token", "remember_me_token_expires_at",
      "reset_password_token", "reset_password_email_sent_at", "reset_password_token_expires_at"
    )
  end

  private

  def set_username
    self.username = name.gsub(" ", "")
  end
end
