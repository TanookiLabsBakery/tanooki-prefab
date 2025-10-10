require "rails_helper"

RSpec.describe "GraphQL Introspection" do
  describe "introspection queries" do
    let(:schema_query) do
      <<~GQL
        query {
          __schema {
            types {
              name
            }
          }
        }
      GQL
    end

    let(:type_query) do
      <<~GQL
        query {
          __type(name: "User") {
            name
          }
        }
      GQL
    end

    context "when introspection is disabled" do
      let(:test_schema) do
        Class.new(GraphQL::Schema) do
          query(Types::QueryType)
          mutation(Types::MutationType)
          use GraphQL::Dataloader
          disable_introspection_entry_points
        end
      end

      it "disables __schema introspection" do
        result = test_schema.execute(schema_query)
        expect(result["errors"]).to be_present
        expect(result["errors"][0]["message"]).to include("__schema")
      end

      it "disables __type introspection" do
        result = test_schema.execute(type_query)
        expect(result["errors"]).to be_present
        expect(result["errors"][0]["message"]).to include("__type")
      end
    end

    context "when introspection is enabled" do
      let(:test_schema) do
        Class.new(GraphQL::Schema) do
          query(Types::QueryType)
          mutation(Types::MutationType)
          use GraphQL::Dataloader
        end
      end

      it "allows __schema introspection" do
        result = test_schema.execute(schema_query)
        expect(result["errors"]).to be_nil
        expect(result["data"]["__schema"]["types"]).to be_present
      end

      it "allows __type introspection" do
        result = test_schema.execute(type_query)
        expect(result["errors"]).to be_nil
        expect(result["data"]["__type"]).to be_present
      end
    end

    context "production configuration" do
      it "disables introspection in production environment" do
        allow(Rails.env).to receive(:production?).and_return(true)
        schema_code = File.read(Rails.root.join("app/graphql/app_schema.rb"))
        expect(schema_code).to include("disable_introspection_entry_points if Rails.env.production?")
      end
    end
  end
end
