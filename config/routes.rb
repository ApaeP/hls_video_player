Rails.application.routes.draw do
  root to: 'pages#home'
  get 'customize', to: 'pages#customize'
end
