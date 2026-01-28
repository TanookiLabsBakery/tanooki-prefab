# general

- this is a rails app with a react frontend
- all frontend code should be written in react (exception: email templates)
- the frontend communicates with the backend exclusively through the graphql api in `app/graphql` - do not use standard rails controllers for frontend requests
- the dev server is already running in the background, do not attempt to start it
- avoid adding comments

# Bash commands

- pnpm run type-check: run the typechecker

# Workflow

- Be sure to typecheck when you're done making a series of code changes
- Prefer running single tests, and not the whole test suite, for performance

## verifying work

Verify work when it's done or before making a pull request:

- [ ] are actions authorized properly?
- [ ] are there any excessive comments that should be removed?
- [ ] is this tested appropriately, and not a tautological test?
- [ ] are formatters, linters and tests all passing?

## frontend

- the package manager is pnpm
- use shadcn components for ui, install new ones with `pnpm dlx shadcn@latest add <component>`
- when conditionally setting classnames, use the cn helper `import { cn } from "~/common/cn"`
- avoid inlining svg code directly, instead put a placeholder like 'TODO: insert graphic'
- avoid using hex values in tailwind classes, use named colors in the tailwind.config.js
- when updating graphql queries and mutations in typescript, make sure to run `pnpm codegen-graphql` to update the generated code, it will fail if there are problems, do not verify that the generated types are updated
- any graphql request from typescript should handle errors, e.g. by displaying <GraphqlError error={error} /> from `import { GraphqlError } from "~/ui/errors"`
- typescript switch cases should be exhaustive, via `default: throw foo satisfies never;`
- all paths used in links should use the path helpers in app/frontend/common/paths.ts e.g. `rootPath({})`
- when adding new screens, ensure they have a document title set (use app/frontend/common/use-document-title.ts)

## backend

- when updating ruby graphql, run `bin/rails graphql:schema:idl` to update the schema.graphql - it will fail if there are problems, do not verify that the generated types are updated
- graphql tests should use the graphql_execute spec helper
- for active record enums use `pg_enum :status, ["active", "inactive"]` instead of `enum :status, {active: "active", inactive: "inactive"}, prefix: true` (pg_enum is a convenience method on ApplicationRecord)
- when creating graphql enums based on an enum that exists in active record, use the rails_enum method on BaseEnum, e.g. `class Enums::ExampleStatusesType < Types::BaseEnum; rails_enum(ExampleModel.statuses); end`

### authorization

- authorization uses the `action_policy` and `action_policy-graphql` gems
  - docs: https://actionpolicy.evilmartians.io/
  - action_policy: https://github.com/palkan/action_policy
  - action_policy-graphql: https://github.com/palkan/action_policy-graphql
- internal admin mutations/queries/input types: use `InternalAdmin::` namespace (e.g. `Mutations::InternalAdmin::UserUpdate`)
- internal admin only fields: `field :user_role, ..., require_internal_admin: true` (simple visibility check)
- contextual access control fields: `field :email, ..., authorize_field: {to: :view_full_user?}` (uses policy rules)

### testing

- do not use the faker gem, prefer rspec sequence for unique values and ruby array sample for random
- do not use or install the shoulda-matchers gem

### migrations

- avoid referencing active record models in migrations, use sql instead when possible
- use the `create_enum`, `add_enum_value` apis to manage postgres enums
- the database annotation comments on the top of models are automatically updated when migrations are run
- when writing migrations, generate a migration with `bin/rails g migration` or `bin/rails g model` and then edit the generated file
