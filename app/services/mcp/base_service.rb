# frozen_string_literal: true

module Mcp
  class BaseService
    private

    def client
      @client ||= Anthropic::Client.new
    end

    def model
      :"claude-opus-4-8"
    end

    def call_api(messages:, max_tokens: 1024)
      client.messages.create(
        model: model,
        max_tokens: max_tokens,
        thinking: {type: "adaptive"},
        messages: messages
      )
    end

    def extract_text(response)
      response.content.find { |b| b.type == :text }&.text
    end
  end
end
