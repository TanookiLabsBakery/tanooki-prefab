class AppOrigin
  def self.url
    ENV["ALLSPARK_ORIGIN"].presence || ENV.fetch("ORIGIN")
  end

  def self.uri
    URI.parse(url)
  end

  def self.host
    uri.host
  end
end
