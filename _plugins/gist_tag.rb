require 'cgi'
require 'digest/md5'
require 'net/https'
require 'uri'

module Jekyll
  class GistTag < Liquid::Tag
    def initialize(tag_name, text, token)
      super
      @text           = text
      @cache_disabled = false
      @cache_folder   = File.expand_path "../_gist_cache", File.dirname(__FILE__)
      FileUtils.mkdir_p @cache_folder
    end

    def render(context)
      if parts = @text.match(/(.*) ([\w]*) (.*)/)
        username, gist_id, file = parts[1].strip, parts[2].strip, parts[3].strip
        script_url = script_url_for username, gist_id, file
        code       = get_cached_gist(gist_id, file) || get_gist_from_web(username, gist_id, file)
        html_output_for script_url, code
      else
        ""
      end
    end

    def html_output_for(script_url, code)
      code = CGI.escapeHTML code
      "<script src='#{script_url}'></script><div><noscript><pre><code>#{code}</code></pre></noscript></div>"
    end

    def script_url_for(username, gist_id, filename)
      if !username.nil?
        "https://gist.github.com/#{username}/#{gist_id}.js?file=#{filename}"
      end
    end

    def get_gist_url_for(username, gist_id, file)
      if !username.nil?
        "https://raw.github.com/#{username}/#{gist_id}/raw/#{file}"
      end
    end

    def cache(gist_id, file, data)
      cache_file = get_cache_file_for gist_id, file
      File.open(cache_file, "w") do |io|
        io.write data
      end
    end

    def get_cached_gist(gist_id, file)
      return nil if @cache_disabled
      cache_file = get_cache_file_for username, gist_id, file
      File.read cache_file if File.exist? cache_file
    end

    def get_cache_file_for(gist_id, file)
      bad_chars = /[^a-zA-Z0-9\-_.]/
      gist_id      = gist_id.gsub bad_chars, ''
      file      = file.gsub bad_chars, ''
      md5       = Digest::MD5.hexdigest "#{gist_id}-#{file}"
      File.join @cache_folder, "#{gist_id}-#{file}-#{md5}.cache"
    end

    def get_gist_from_web(username, gist_id, file)
      gist_url          = get_gist_url_for username, gist_id, file
      raw_uri           = URI.parse gist_url
      https             = Net::HTTP.new raw_uri.host, raw_uri.port
      https.use_ssl     = true
      https.verify_mode = OpenSSL::SSL::VERIFY_NONE
      request           = Net::HTTP::Get.new raw_uri.request_uri
      data              = https.request request
      data              = data.body
      cache gist_id, file, data unless @cache_disabled
      data
    end
  end

  class GistTagNoCache < GistTag
    def initialize(tag_name, text, token)
      super
      @cache_disabled = true
    end
  end
end

Liquid::Template.register_tag('gist', Jekyll::GistTag)
Liquid::Template.register_tag('gistnocache', Jekyll::GistTagNoCache)
