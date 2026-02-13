require "rails_helper"

RSpec.describe AppConfig do
  describe ".config" do
    it "provides direct access to config variables" do
      expect(AppConfig.app_name).to be_a(String)
      expect(AppConfig.default_from_email).to be_a(String)
    end

    it "evaluates lazy config variables" do
      expect(AppConfig.direct_uploads_url).to be_a(String)
      expect(AppConfig.direct_uploads_url).to include("direct_uploads")
    end
  end

  describe ".frontend_json_schema" do
    it "generates JSON schema for frontend configs only" do
      schema = AppConfig.frontend_json_schema
      frontend_config_names = AppConfig.configs.select { |_, c| c[:frontend] }.keys.map(&:to_s)

      expect(schema[:type]).to eq("object")
      expect(schema[:properties].keys).to match_array(frontend_config_names)
      schema[:properties].each_value do |prop|
        expect(prop).to eq({type: "string"})
      end
    end

    it "excludes non-frontend configs from schema" do
      schema = AppConfig.frontend_json_schema
      non_frontend_config_names = AppConfig.configs.reject { |_, c| c[:frontend] }.keys.map(&:to_s)

      non_frontend_config_names.each do |name|
        expect(schema[:properties].keys).not_to include(name)
      end
    end
  end

  describe ".each_frontend_config" do
    it "iterates over frontend configs only" do
      configs = {}
      AppConfig.each_frontend_config do |name, value|
        configs[name] = value
      end

      frontend_config_names = AppConfig.configs.select { |_, c| c[:frontend] }.keys

      expect(configs.keys).to match_array(frontend_config_names)
      configs.each_value do |value|
        expect(value).to be_a(String)
      end
    end

    it "excludes non-frontend configs from iteration" do
      config_names = []
      AppConfig.each_frontend_config do |name, _value|
        config_names << name
      end

      non_frontend_config_names = AppConfig.configs.reject { |_, c| c[:frontend] }.keys

      non_frontend_config_names.each do |name|
        expect(config_names).not_to include(name)
      end
    end

    it "returns an enumerator when no block given" do
      enumerator = AppConfig.each_frontend_config
      frontend_config_count = AppConfig.configs.count { |_, c| c[:frontend] }

      expect(enumerator).to be_a(Enumerator)
      expect(enumerator.to_a.size).to eq(frontend_config_count)
    end
  end
end
