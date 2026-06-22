# frozen_string_literal: true

module Mcp
  class BestTimeSuggestionService < BaseService
    BEST_HOURS = [9, 13].freeze

    def initialize(channel)
      @channel = channel
    end

    def call
      suggestions = []
      current_time = Time.current
      date = current_time.to_date

      14.times do
        if date.on_weekday?
          BEST_HOURS.each do |hour|
            candidate = Time.utc(date.year, date.month, date.day, hour)
            if candidate > current_time
              suggestions << candidate
              return suggestions if suggestions.length >= 2
            end
          end
        end
        date += 1
      end

      suggestions
    end
  end
end
