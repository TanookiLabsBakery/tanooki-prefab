class ConfigBuilder
  class << self
    def config(name, default_value, frontend: false)
      configs[name] = {value: default_value, frontend: frontend}

      define_singleton_method(name) do
        value = configs[name][:value]
        value.respond_to?(:call) ? value.call : value
      end
    end

    def configs
      @configs ||= {}
    end

    def frontend_json_schema
      {
        type: "object",
        properties: configs
          .select { |_, config| config[:frontend] }
          .transform_keys(&:to_s)
          .transform_values { {type: "string"} }
      }
    end

    def each_frontend_config
      return enum_for(:each_frontend_config) unless block_given?

      configs.each do |name, config|
        if config[:frontend]
          value = config[:value]
          value = value.call if value.respond_to?(:call)
          yield(name, value)
        end
      end
    end
  end
end
