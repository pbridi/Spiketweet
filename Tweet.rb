#!/usr/bin/env ruby
require 'rubygems'
require 'sinatra'
require 'twitter_oauth'
require 'yaml'

configure do
  set :sessions, true
  @@config = YAML.load_file("config.yml")
end

before do
  next if request.path_info =~ /ping$/
  @user = session[:user]
  @client = TwitterOAuth::Client.new(
    :consumer_key => ENV['CONSUMER_KEY'] || @@config['consumer_key'],
    :consumer_secret => ENV['CONSUMER_SECRET'] || @@config['consumer_secret'],
    :token => session[:access_token],
    :secret => session[:secret_token]
  )

  @rate_limit_status = @client.rate_limit_status
end

get '/' do
  redirect '/timeline' if @user
  @trends = @client.current_trends
  @tweets = @client.public_timeline
  erb :home
end

get '/timeline' do
  @tweets = @client.friends_timeline
  erb :timeline
end

get '/battle' do
  @friends =  @client.friends
  erb :battle
end

get '/mentions' do
  @tweets = @client.mentions
  erb:timeline
end

get '/retweets' do
  @tweets = @client.retweets_of_me
  erb:timeline
end

get '/retweeted' do
  @tweets = @client.retweeted_by_me
  erb:timeline
end

post '/update' do
  @client.update(params[:update])
  redirect '/timeline'
end

get '/messages' do
  @sent = @client.sent_messages
  @received = @client.messages
  erb :messages
end

get '/search' do
  params[:q] ||= '#dev'
  @search = @client.search(params[:q], :page => params[:page], :per_page => params[:per_page])
  erb :search
end

# store the requested token and send to twitter
get '/connect' do
  request_token = @client.request_token(
    :oauth_callback => ENV['CALLBACK_URL'] || @@config['callback_url']
  )
  session[:request_token] = request_token.token
  session[:request_token_secret] = request_token.secret
  redirect request_token.authorize_url.gsub('authorize', 'authenticate') 
end

get '/auth' do
  # Exchange the request token for an access token.
  
  begin
    @access_token = @client.authorize(
      session[:request_token],
      session[:request_token_secret],
      :oauth_verifier => params[:oauth_verifier]
    )
  rescue OAuth::Unauthorized
  end
  
  if @client.authorized?
      session[:access_token] = @access_token.token
      session[:secret_token] = @access_token.secret
      session[:user] = true
      redirect '/timeline'
    else
      redirect '/'
  end
end

get '/disconnect' do
  session[:user] = nil
  session[:request_token] = nil
  session[:request_token_secret] = nil
  session[:access_token] = nil
  session[:secret_token] = nil
  redirect '/'
end

helpers do 
  def partial(name, options={})
    erb("_#{name.to_s}".to_sym, options.merge(:layout => false))
  end
end