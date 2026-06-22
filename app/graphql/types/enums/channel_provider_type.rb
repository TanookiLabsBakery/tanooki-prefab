# frozen_string_literal: true

module Types
  class Enums::ChannelProviderType < Types::BaseEnum
    description "Channel provider enum"
    rails_enum(Channel.providers)
  end
end
