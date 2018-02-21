# frozen_string_literal: true

class TodosController < ApplicationController
  # helper_method :filtering_params

  def index
    load_todos
  end

  def create
    unless Todo.create(todo_params.merge(session_user_id: session_user))
      flash[:alert] = 'Cannot create a new task'
    end
    load_and_render_index
  end

  def update
    p todo_params[:title]
    if Todo.find(params[:id]).update(todo_params.to_h)
      head :ok
    else
      flash[:alert] = 'Todo title cannot be blank'
      load_and_render_index
    end
  end

  def update_many
    toggle = params[:toggle] == "true"
    if Todo.belonging_to(session_user).completed(!toggle).each { |todo| todo.update(completed: toggle) }
        head :ok
    else
      flash[:alert] = 'Unable to update tasks'
      load_and_render_index
    end
  end

  def destroy
    if Todo.belonging_to(session_user).find_by(id: params[:id]).try(:destroy)
      head :ok
    else
      flash[:alert] = 'Unable to delete task'
      load_and_render_index
    end
  end

  def destroy_many
    if Todo.belonging_to(session_user).completed(true).try(:destroy_all)
      head :ok
    else
      flash[:alert] = 'Unable to delete tasks'
      load_and_render_index
    end
  end

  private

  def todo_params
    params.require(:todo).permit(:id, :title, :completed, :completed_filter)
  end

  def load_and_render_index
    load_todos
    @params = params[:completed_filter].blank? ? '' : { completed: params[:completed_filter] }
    redirect_to todos_path
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
