module.exports = {
  apps: [{
    name: 'myapp',
    script: 'server.js',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/myapp/error.log',
    out_file: '/var/log/myapp/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    
    // Health check settings
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000,
    
    // Deployment optimization
    min_uptime: '10s',
    max_restarts: 10,
    
    // Zero-downtime deployment
    increment_var: 'PORT',
    
    // Advanced features
    instance_var: 'INSTANCE_ID'
  }]
};
