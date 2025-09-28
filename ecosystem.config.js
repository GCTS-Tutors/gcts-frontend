module.exports = {
  apps: [
    {
      name: 'gcts-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/home/ubuntu/gcts/frontend',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/home/ubuntu/gcts/logs/frontend-error.log',
      out_file: '/home/ubuntu/gcts/logs/frontend-out.log',
      log_file: '/home/ubuntu/gcts/logs/frontend-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 5000
    }
  ],

  deploy: {
    production: {
      user: 'ubuntu',
      host: 'your-ec2-host',
      ref: 'origin/develop',
      repo: 'https://github.com/yourusername/gcts.git',
      path: '/home/ubuntu/gcts',
      'post-deploy': 'cd frontend && npm install && npm run build && pm2 reload ecosystem.config.js --env production'
    }
  }
};