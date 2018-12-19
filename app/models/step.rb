# == Schema Information
#
# Table name: steps
#
#  id         :integer          not null, primary key
#  recipe_id  :integer
#  text       :text
#  position   :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Step < ApplicationRecord
  belongs_to :recipe

  validates_presence_of :recipe
end
