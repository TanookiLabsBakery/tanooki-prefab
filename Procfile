web: bundle exec puma -C config/puma.rb
worker: bin/sidekiq -C config/sidekiq.yml
release: bundle exec rake db:migrate
