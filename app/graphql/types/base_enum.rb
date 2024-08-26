module Types
  class BaseEnum < GraphQL::Schema::Enum
    def self.rails_enum(values)
      values.keys.each do |key|
        value(key.upcase, value: key)
      end
    end
  end
end
