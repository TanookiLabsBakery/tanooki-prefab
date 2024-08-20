class ApplicationRecord < ActiveRecord::Base
  include CoolId::Model

  primary_abstract_class
  enforce_cool_id_for_descendants
end
