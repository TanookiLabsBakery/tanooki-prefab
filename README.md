# Tanooki Prefab

## Development Setup

### Prerequisites

- [pnpm](https://pnpm.io/installation)
- [postgres](https://www.postgresql.org/download/) (or use [containerized PostgreSQL](#running-postgres-in-a-container))
- [redis](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/) (or use [containerized Redis](#running-redis-in-a-container))

### Setup

```bash
bin/setup
bin/dev
```

## Emails

This application uses [MJML](https://mjml.io/) for building responsive email templates.

### Previewing Emails

For development, you can view/manage sent emails at `/letter_opener`

## Running Containers

You can run PostgreSQL and Redis in containers instead of installing them locally.

**Note:** These instructions use Apple's [Container](https://github.com/apple/container) tool. Docker and other container tools should also work but aren't documented here yet.

### Initial Setup

```bash
brew install --cask container
just setup container-setup
```

Add to `.env.development.local`:

```
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5433
DATABASE_USERNAME=postgres
REDIS_URL=redis://127.0.0.1:6380/1
```

**Note:** The default ports are PostgreSQL: `5433`, Redis: `6380`. You can customize these by setting `CONTAINER_POSTGRES_PORT` and `CONTAINER_REDIS_PORT` in your `.env` file. This allows multiple apps from this template to run simultaneously on the same machine. rebuild the container after changing this via `just container destroy && just container start`

### Container Management

```bash
just container start   # Start containers
just container stop    # Stop containers
just container restart # Restart containers
just container destroy # Remove containers and volumes
```

View logs:

```bash
just container logs-postgres
just container logs-redis
```

## S3 Setup Script

The `bin/setup-s3` script automates the process of creating S3 buckets and configuring them for use
with a Rails application.

<details>
<summary>Click to expand S3 setup details</summary>

It will:

- Create an S3 bucket in your specified region.
- Set up CORS (Cross-Origin Resource Sharing) for the bucket with http://localhost:5100 as the
  allowed origin.
- Create a new IAM user with access to the created S3 bucket.
- Attach an IAM policy that allows the user to perform basic actions on the S3 bucket (such as
  listing, getting, putting, and deleting objects).
- Output the IAM user's credentials for use in your Rails app.

### Prerequisites

Before using this script, you must have the following prerequisites configured:

1. **AWS CLI**: The AWS CLI must be installed and configured on your machine. You can follow the
   official AWS CLI installation guide to set it up.

2. **IAM User**: You must have an IAM user configured in your AWS CLI with the following
   permissions:

- `AmazonS3FullAccess` or equivalent for creating and managing S3 buckets.
- `IAMFullAccess` or equivalent for creating IAM users and policies.

3. Configure your AWS CLI with `aws configure` and input the access and secret key from this IAM
   user.

### Running the Script

Run the script with the following command:

```
./setup-s3.sh
```

The script will prompt you to enter a bucket name (e.g., myapp-staging).

Once the bucket is created, the script will automatically configure CORS for the bucket and generate
IAM user credentials for accessing the bucket. **The CORS policy will by default provide an allowed
origin of localhost:5100. Additional allowed origins will need to be added manually.**

The generated IAM credentials will be displayed on the screen. Make sure to copy them as they will
not be shown again.

</details>

## Tanooki Prefab

This project was initiated with [Tanooki Prefab](https://github.com/TanookiLabs/tanooki-prefab).
Changes to prefab can be brought into this project and vice versa.

### Moving Changes from Prefab into This Project

Connect prefab:

```bash
cd path/to/example-project
git remote add prefab git@github.com:TanookiLabs/tanooki-prefab.git
```

```bash
git fetch prefab
git cherry-pick <ref>
```

## Staging setup

### Setup the tanookiapp.com subdomain

this requires [jo](https://github.com/jpmens/jo), [jq](https://jqlang.github.io/jq/), and the
[1password cli](https://developer.1password.com/docs/cli/get-started/)

```bash
just setup::tanookiapp-heroku-domains-add-staging
just setup::tanookiapp-cloudflare-set-cname-staging
just setup::tanookiapp-certs-staging
just setup::tanookiapp-heroku-set-origin-staging
```

### Setup email

1. set `POSTMARK_API_TOKEN` environment variable
1. set `EMAIL_HOST_ALLOWLIST` to a list of domains that can receive email, e.g.
   `tanookilabs.com,exampleclient.co`
1. set `DANGEROUS__AUTH_BYPASS_CODE`, e.g. to "000000" to allow a code to bypass OTP auth
