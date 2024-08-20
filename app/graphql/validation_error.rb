# https://graphql-ruby.org/errors/execution_errors#customizing-error-json
class ValidationError < GraphQL::ExecutionError
  attr_accessor :record

  def initialize(message, options: nil, extensions: nil, ast_node: nil, record: nil)
    @record = record
    super(message, ast_node: ast_node, options: options, extensions: extensions)
  end

  def to_h
    validation_errors = []
    record.errors.each do |validation_error|
      validation_errors << {
        "field" => validation_error.attribute.to_s.camelize(:lower),
        "resource" => record.class.name,
        "fullMessage" => validation_error.full_message,
        "message" => validation_error.message,
        "type" => validation_error.type.to_s
      }
    end

    extensions = super.fetch("extensions", {})
    extensions["code"] = "VALIDATION_ERROR"
    extensions["validationErrors"] = validation_errors

    super.merge({"extensions" => extensions})
  end
end
