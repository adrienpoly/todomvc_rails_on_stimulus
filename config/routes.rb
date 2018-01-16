# frozen_string_literal: true

Rails.application.routes.draw do
  root to: 'todos#index'
  resources :todos, only: %i[index create update destroy], path: '' do
    collection do
      put 'update_many', to: 'todos#update_many'
      delete 'destroy_many', to: 'todos#destroy_many'
    end
  end
end
