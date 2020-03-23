ruby '2.5.7'
source 'https://rubygems.org'

gem 'rails',        '5.2.4.1'
gem 'puma'
gem 'sass-rails'
gem 'uglifier'
gem 'coffee-rails'
gem 'jquery-rails'
gem 'turbolinks'
gem 'jbuilder'
gem 'sorcery'
gem 'webpacker'
gem 'react-rails'
gem 'kaminari'
gem 'elasticsearch-model'
gem 'elasticsearch-rails'

group :development, :test do
	gem 'faker', '> 1.5.0'
  gem "shoulda"

  gem 'rspec-rails'
  gem 'factory_bot_rails'

	gem 'sqlite3'
  gem 'byebug'
  gem 'annotate'
end

group :production do
  gem 'pg'
  gem 'bonsai-elasticsearch-rails'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
