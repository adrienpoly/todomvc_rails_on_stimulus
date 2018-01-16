# frozen_string_literal: true

class Todo < ApplicationRecord
  validates :title, presence: true

  scope :completed, ->(status) { where(completed: status) }
  scope :belonging_to, ->(session_user_id) { where(session_user_id: session_user_id) }
end
