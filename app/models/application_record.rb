class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  scope :since_date, ->(date) { where('date >= ?', date) }
end
