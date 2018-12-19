# == Schema Information
#
# Table name: ingredients
#
#  id         :integer          not null, primary key
#  recipe_id  :integer
#  text       :text
#  position   :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Ingredient < ApplicationRecord
  belongs_to :recipe, inverse_of: :ingredients

  validates_presence_of :recipe
  validates_uniqueness_of :position, scope: :recipe_id

  default_scope { order(position: :asc) }

  def as_json(*)
    super.except("recipe_id", "created_at", "updated_at")
  end
end
