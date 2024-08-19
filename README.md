# README

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
