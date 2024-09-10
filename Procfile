web: bundle exec puma -C config/puma.rb
worker: RAILS_MAX_THREADS=$((${GOOD_JOB_MAX_THREADS:-5}+3)) bundle exec good_job start
release: bundle exec rake db:migrate
