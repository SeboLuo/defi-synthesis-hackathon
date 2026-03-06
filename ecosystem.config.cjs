module.exports = {
  apps: [{
    name: 'defi-advisor',
    script: './src/api-server.js',
    cwd: '/root/.openclaw/workspace/projects/defi-advisor',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    max_memory_restart: '500M',
    autorestart: true,
    watch: false
  }]
};
