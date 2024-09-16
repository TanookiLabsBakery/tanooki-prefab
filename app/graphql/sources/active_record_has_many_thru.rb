module Sources
  class ActiveRecordHasManyThru < GraphQL::Dataloader::Source
    def initialize(model_class, association)
      @model_class = model_class
      @association = association
    end

    def fetch(ids)
      records = @model_class.where(id: ids).includes(@association)

      ids.map do |id|
        record = records.detect { |r| r.id == id }
        record.public_send(@association)
      end
    end
  end
end
