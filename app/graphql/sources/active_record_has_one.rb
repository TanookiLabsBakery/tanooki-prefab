module Sources
  class ActiveRecordHasOne < GraphQL::Dataloader::Source
    def initialize(model_class, foreign_key, where_options = {})
      @model_class = model_class
      @foreign_key = foreign_key
      @where_options = where_options
    end

    def fetch(ids)
      records = @model_class.where(@foreign_key => ids, **@where_options).index_by(&@foreign_key)

      ids.map do |id|
        records[id]
      end
    end
  end
end
