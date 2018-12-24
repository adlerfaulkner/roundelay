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
  include Elasticsearch::Model
  include ActiveModel::Dirty

  has_many :ingredients, inverse_of: :recipe, dependent: :destroy,
    after_add: [ lambda { |r,i| r.__elasticsearch__.index_document if r.published } ],
    after_remove: [ lambda { |r,i| r.__elasticsearch__.index_document if r.published } ]
  has_many :steps, inverse_of: :recipe, dependent: :destroy,
    after_add: [ lambda { |r,s| r.__elasticsearch__.index_document if r.published } ],
    after_remove: [ lambda { |r,s| r.__elasticsearch__.index_document if r.published } ]
  belongs_to :creator, class_name: 'User'
  belongs_to :writer, class_name: 'User'

  validates_presence_of :writer
  validates :ingredients, presence: true
  validates :steps, presence: true

  after_commit on: [:create] do
    __elasticsearch__.index_document if self.published?
  end

  after_commit on: [:update] do
    if self.previous_changes.key?("published") && !self.previous_changes["published"].first && self.previous_changes["published"].last
      __elasticsearch__.index_document
    elsif self.published?
      __elasticsearch__.update_document
    end
  end

  after_commit on: [:destroy] do
    __elasticsearch__.delete_document if self.published?
  end

  accepts_nested_attributes_for :ingredients, :steps, allow_destroy: true

  default_scope { order(created_at: :desc) }
  scope :published, -> { where(published: true ) }
  scope :unpublished, -> { where(published: false ) }
  scope :written_by, -> (user) { where(writer_id: user.id) }

  settings index: { number_of_shards: 1 } do
    mappings dynamic: 'false' do
      indexes :title, type: :text, analyzer: :english
      indexes :description, type: :text, analyzer: :english
      indexes :body, type: :text, analyzer: :english
    end
  end

  def self.search(query)
   __elasticsearch__.search(
   {
     query: {
        multi_match: {
          query: query,
          fields: ['title', "description", "body"]
        }
      }
   })
 end

  def as_indexed_json(options={})
    {
      title: title.blank? ? "untitled" : title.downcase,
      description: description&.downcase,
      body: body.downcase,
    }
  end

  def body
    [*ingredients.map(&:text), *steps.map(&:text)].join(" ")
  end

  def as_json(*)
    super.except("creator_id", "writer_id", "updated_at", "created_at").tap do |recipe|
      recipe["creator"] = self.creator&.as_json
      recipe["writer"] = self.writer&.as_json
      recipe["steps"] = self.steps.map(&:as_json)
      recipe["ingredients"] = self.ingredients.map(&:as_json)
    end
  end

  def can_edit?(user_id)
    creator_id == user_id || writer_id == user_id
  end
end
