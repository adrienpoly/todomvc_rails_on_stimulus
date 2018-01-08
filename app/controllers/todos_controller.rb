class TodosController < ApplicationController
  helper_method :filtering_params

  def index
    load_todos
  end

  def create
    Todo.create(todo_params.merge(session_user_id: session_user))
    load_and_render_index
  end

  def update
    Todo.find(params[:id]).update(todo_params.to_h)
    load_and_render_index
  end

  def update_many
    Todo.where(id: params[:ids]).update_all(todo_params.to_h)
    load_and_render_index
  end


  def destroy
    Todo.find_by(id: params[:id]).try(:destroy)
    load_and_render_index
  end

  def destroy_many
    Todo.where(id: params[:ids]).try(:destroy_all)
    load_and_render_index
  end

  private

  def todo_params
    p params
    params.require(:todo).permit(:id, :title, :completed)
  end

  def load_and_render_index
    load_todos
    # url_params = params[:completed] ? { completed: params[:completed] } : ""
    # redirect_to root_path(url_params)
    render :index
  end

  # def filtering_params
  #   params.slice(:completed).to_unsafe_h
  # end

  def load_todos
    @todos = Todo.belonging_to(session_user).order(created_at: :asc)

    # filtering_params.each do |key, value|
      # @todos = @todos.public_send(key, value) if value.present?
    # end
  end
end
