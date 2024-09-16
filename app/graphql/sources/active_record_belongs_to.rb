module Sources
  class ActiveRecordBelongsTo < GraphQL::Dataloader::Source
    def initialize(model_class)
      @model_class = model_class
    end

    def fetch(ids)
      records = @model_class.where(id: ids)

      ids.map do |id|
        records.detect { |record| record.id == id }
      end
    end
  end
end
