module.exports = {
  apps: [
    {
      name: 'neyagawa-mockAPI',
      exec_mode: 'cluster',
      watch: true,
      instances: 'max',
      script: './node_modules/nodemon/bin/nodemon.js',
      args: 'server.js',
    },
  ],
};
