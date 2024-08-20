set dotenv-load

dev:
    bin/dev

aider-rb *args:
  aider -c .config/aider.conf.rb.yml --cache-prompts {{args}}

aider-js *args:
  aider -c .config/aider.conf.js.yml --cache-prompts {{args}}
