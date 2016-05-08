# config valid only for current version of Capistrano
lock '3.5.0'

set :application, 'snowfight'
set :repo_url, 'git@github.com:Andreis13/snowfight.git'

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, '/home/andrew/apps/snowfight'

# Default value for :scm is :git
# set :scm, :git

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: 'log/capistrano.log', color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# set :linked_files, fetch(:linked_files, []).push('config/database.yml', 'config/secrets.yml')

# Default value for linked_dirs is []
# set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'public/system')
set :linked_dirs, fetch(:linked_dirs, []).push('log')

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }
set :default_env, { path: "/home/andrew/.npm-global/bin:$PATH" }

# Default value for keep_releases is 5
# set :keep_releases, 5


namespace :snowfight do
  task :setup do
    on roles :web do
      execute :npm, 'install', '-g', 'forever'
    end
  end
end

namespace :peerjs do
  task :start do
    on roles :web do
      within release_path do
        execute :forever, 'start', 'config/forever/production.json'
      end
    end
  end

  task :stop do
    on roles :web do
      within release_path do
        execute :forever, 'stop', 'peerjs-server'
      end
    end
  end

  task :restart do
    on roles :web do
      within release_path do
        execute :forever, 'restart', 'peerjs-server'
      end
    end
  end
end

task :setup do
  invoke 'snowfight:setup'
end
