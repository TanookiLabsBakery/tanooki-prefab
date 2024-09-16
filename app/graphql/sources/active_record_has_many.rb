module Sources
  class ActiveRecordHasMany < GraphQL::Dataloader::Source
    def initialize(model_class, foreign_key, query: nil, scopes: nil)
      @model_class = model_class
      @foreign_key = foreign_key
      @query = query
      @scopes = scopes
    end

    def fetch(ids)
      records = @model_class.where(@foreign_key => ids)
        .order(created_at: :desc)
      records = records.where(@query) if @query.present?
      @scopes&.each do |scope|
        records = records.public_send(scope)
      end
      mapped_records = records.group_by(&@foreign_key)

      # return a list with `nil` for any ID that wasn't found
      ids.map do |id|
        mapped_records[id] || []
      end
    end
  end
end
