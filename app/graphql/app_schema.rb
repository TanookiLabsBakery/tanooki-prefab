# frozen_string_literal: true

class AppSchema < GraphQL::Schema
  mutation(Types::MutationType)
  query(Types::QueryType)

  # For batch-loading (see https://graphql-ruby.org/dataloader/overview.html)
  use GraphQL::Dataloader

  disable_introspection_entry_points if Rails.env.production?

  rescue_from(ActionPolicy::Unauthorized) do |err|
    raise GraphQL::ExecutionError.new(
      "Not authorized",
      extensions: {code: "NOT_AUTHORIZED"}
    )
  end

  use GraphQL::Schema::Visibility, profiles: {
    public: {},
    internal_admin: {internal_admin: true}
  }

  # GraphQL-Ruby calls this when something goes wrong while running a query:
  def self.type_error(err, context)
    # if err.is_a?(GraphQL::InvalidNullError)
    #   # report to your bug tracker here
    #   return nil
    # end
    super
  end

  # Union and Interface Resolution
  def self.resolve_type(abstract_type, obj, ctx)
    case obj
    when User
      Types::Objects::UserType
    when Post
      Types::Objects::PostType
    when PostChannelVariant
      Types::Objects::PostChannelVariantType
    when PostAnalytic
      Types::Objects::PostAnalyticType
    else
      raise(GraphQL::RequiredImplementationMissingError, "Unexpected object: #{obj}")
    end
  end

  # Limit the size of incoming queries:
  max_query_string_tokens(5000)

  # Stop validating when it encounters this many errors:
  validate_max_errors(100)

  # Relay-style Object Identification:

  # Return a string UUID for `object`
  def self.id_from_object(object, type_definition, query_ctx)
    object.id
  end

  # Given a string UUID, find the object
  def self.object_from_id(global_id, query_ctx)
    CoolId.locate(global_id)
  end

  default_max_page_size 250
  default_page_size 50
end
