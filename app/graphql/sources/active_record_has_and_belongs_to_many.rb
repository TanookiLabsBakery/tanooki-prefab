module Sources
  class ActiveRecordHasAndBelongsToMany < GraphQL::Dataloader::Source
    def initialize(model_class, key)
      @model_class = model_class
      @key = key
    end

    def fetch(ids)
      records = @model_class.where(id: ids).includes(@key)

      # map the results to the input ID
      ids.map do |id|
        records.detect { |r| r.id == id }&.public_send(@key)
      end
    end
  end
end
