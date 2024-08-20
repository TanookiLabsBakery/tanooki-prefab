set dotenv-load

dev:
    bin/dev

aider-rb *args:
  aider -c .config/aider.conf.rb.yml {{args}}

aider-js *args:
  aider -c .config/aider.conf.js.yml {{args}}
