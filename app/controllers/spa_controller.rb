class SpaController < ApplicationController
  def index
  end

  helper_method :viewer_cache_data
  def viewer_cache_data
    viewer_query = <<~GRAPHQL
      query Viewer {
        viewer {
          __typename
          ...CachedViewerContext
        }
      }
      #{self.class.viewer_fragment}
    GRAPHQL

    AppSchema.execute(viewer_query, context: {current_user:})
  end

  def self.viewer_fragment
    @viewer_fragment ||= File.read(Rails.root.join("app/frontend/auth/cached-viewer-context.graphql"))
  end
end
