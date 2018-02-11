# frozen_string_literal: true

class TodosController < ApplicationController
  # helper_method :filtering_params

  def index
    load_todos
  end

  def create
    Todo.create(todo_params.merge(session_user_id: session_user))
    load_and_render_index
  end

  def update
    todo = Todo.belonging_to(session_user).find(params[:id])
    todo.update(todo_params.to_h)
    render todo
  end

  def update_many
    Todo.belonging_to(session_user)
        .where(id: params[:ids])
        .update_all(todo_params.to_h.merge(updated_at: Time.zone.now))
    load_and_render_index
  end

  def destroy
    Todo.belonging_to(session_user).find_by(id: params[:id]).try(:destroy)
    load_and_render_index
  end

  def destroy_many
    Todo.belonging_to(session_user).where(id: params[:ids]).try(:destroy_all)
    load_and_render_index
  end

  private

  def todo_params
    params.require(:todo).permit(:id, :title, :completed, :completed_filter)
  end

  def load_and_render_index
    load_todos
    @params = params[:completed_filter].blank? ? '' : { completed: params[:completed_filter] }
    render :index, layout: false
  end

  # def filtering_params
  #   params.slice(:completed).to_unsafe_h
  # end

  def load_todos
    @todos = Todo.belonging_to(session_user).order(created_at: :asc)
    fresh_when(@todos)
    # filtering_params.each do |key, value|
    # @todos = @todos.public_send(key, value) if value.present?
    # end
  end
end
