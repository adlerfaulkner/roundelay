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
  has_many :ingredients, inverse_of: :recipe, dependent: :destroy
  has_many :steps, inverse_of: :recipe, dependent: :destroy
  belongs_to :creator, class_name: 'User'
  belongs_to :writer, class_name: 'User'

  validates_presence_of :writer
  validates :ingredients, presence: true
  validates :steps, presence: true

  accepts_nested_attributes_for :ingredients, :steps, allow_destroy: true

  default_scope { order(created_at: :desc) }
  scope :published, -> { where(published: true ) }
  scope :unpublished, -> { where(published: false ) }

  searchable :if => :published do
    text :text, as: :text_textinc do
      text_for_search.downcase
    end
  end

  def text_for_search
    title_for_search = title
    if title.length < 1
      title_for_search = 'Untitled'
    end
    [title_for_search, description, writer.name, *ingredients.map(&:text), *steps.map(&:text)].join(" ")
  end

  def as_json(*)
    super.except("creator_id", "writer_id", "updated_at", "created_at").tap do |recipe|
      recipe["creator"] = self.creator&.to_json
      recipe["writer"] = self.writer&.to_json
      recipe["steps"] = self.steps.map(&:to_json)
      recipe["ingredients"] = self.ingredients.map(&:to_json)
    end
  end

  def can_edit?(user_id)
    creator_id == user_id || writer_id == user_id
  end
end
