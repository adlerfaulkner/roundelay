# == Schema Information
#
# Table name: recipes
#
#  id          :integer          not null, primary key
#  creator_id  :integer
#  writer_id   :integer
#  title       :string
#  description :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Recipe < ApplicationRecord
  has_many :ingredients
  has_many :steps
  belongs_to :creator, class_name: 'User'
  belongs_to :writer, class_name: 'User'

  validates_presence_of :writer
end
