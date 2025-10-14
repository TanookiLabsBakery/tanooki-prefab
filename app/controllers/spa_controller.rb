class SpaController < ApplicationController
  def index
  end

  helper_method :preloaded_data
  def preloaded_data
    query = <<~GRAPHQL
      query Viewer {
        viewer {
          __typename
          ...CachedViewerContext
        }
        uiAccess {
          __typename
          ...CachedUiAccessContext
        }
      }
      #{self.class.viewer_fragment}
      #{self.class.ui_access_fragment}
    GRAPHQL

    visibility_profile = if current_user && InternalAdminPolicy.new(nil, user: current_user).apply(:view?)
      :internal_admin
    else
      :public
    end

    context = {current_user:, visibility_profile:}

    AppSchema.execute(query, context:)
  end

  def self.viewer_fragment
    @viewer_fragment ||= File.read(Rails.root.join("app/frontend/auth/cached-viewer-context.graphql"))
  end

  def self.ui_access_fragment
    @ui_access_fragment ||= File.read(Rails.root.join("app/frontend/auth/cached-ui-access-context.graphql"))
  end
end
