Rails.application.routes.draw do
  root "home#index"

  namespace :api do
    namespace :v1 do
      resources :users, only: [:create, :index]
      resources :recipes, only: [:create, :index, :update] do
        collection do
          get :drafts
        end
      end
      post '/login' => 'sessions#create'
      delete '/logout' => 'sessions#destroy'
    end
  end
end
