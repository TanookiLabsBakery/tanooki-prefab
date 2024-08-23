class ApplicationRecord < ActiveRecord::Base
  include CoolId::Model

  primary_abstract_class
  enforce_cool_id_for_descendants

  def self.pg_enum(name, values)
    value_map = values.each_with_object({}) { |value, map| map[value.to_sym] = value.to_s }
    enum name, value_map, prefix: true
  end
end
