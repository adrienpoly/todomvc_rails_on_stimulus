class CreateTodos < ActiveRecord::Migration[5.1]
  def change
    create_table :todos do |t|
      t.string :title, default: "", null: false
      t.boolean :completed, default: false
      t.string :session_user_id, null: false

      t.timestamps
    end
  end
end
