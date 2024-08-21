# README

## Table of Contents

- [dev setup](#dev-setup)
- [emails](#emails)
- [s3 setup script](#s3-setup-script)

## dev setup

### prerequisites

- [pnpm](https://pnpm.io/installation)
- [postgres](https://www.postgresql.org/download/)

### setup

```bash
bin/setup
bin/dev
```

## emails

this application uses [MJML](https://mjml.io/) for building responsive email templates, combined
with ERB for dynamic content rendering in Rails.

### previewing emails

For development, you can view/manage sent emails at `/letter_opener`

## s3 setup script

The `bin/setup-s3` script automates the process of creating S3 buckets and configuring them for use
with a Rails application. It will:

- Create an S3 bucket in your specified region.
- Set up CORS (Cross-Origin Resource Sharing) for the bucket with http://localhost:5100 as the
  allowed origin.
- Create a new IAM user with access to the created S3 bucket.
- Attach an IAM policy that allows the user to perform basic actions on the S3 bucket (such as
  listing, getting, putting, and deleting objects).
- Output the IAM user's credentials for use in your Rails app.

### prerequisites

Before using this script, you must have the following prerequisites configured:

1. **AWS CLI**: The AWS CLI must be installed and configured on your machine. You can follow the
   official AWS CLI installation guide to set it up.

2. **IAM User**: You must have an IAM user configured in your AWS CLI with the following
   permissions:

- `AmazonS3FullAccess` or equivalent for creating and managing S3 buckets.
- `IAMFullAccess` or equivalent for creating IAM users and policies.

3. Configure your AWS CLI with `aws configure` and input the access and secret key from this IAM
   user.

### running the script

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
