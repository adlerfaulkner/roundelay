class CreateRecipes < ActiveRecord::Migration[5.0]
  def change
    create_table :recipes do |t|
      t.integer :creator_id, index: true, foreign_key: true
      t.integer :writer_id, index: true, foreign_key: true
      t.string :title
      t.text :description
      t.timestamps                :null => false
    end
    create_table :ingredients do |t|
      t.references :recipe, index: true, foreign_key: true
      t.text :text
      t.integer :position, :null => false
      t.timestamps        :null => false
    end
    create_table :steps do |t|
      t.references :recipe, index: true, foreign_key: true
      t.text :text
      t.integer :position, :null => false
      t.timestamps                :null => false
    end
  end
end
