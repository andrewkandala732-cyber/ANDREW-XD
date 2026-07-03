module.exports = {
  apps: [{
    name: 'fee-v7',
    script: 'index.js',
    interpreter: 'node',
    node_args: '--experimental-specifier-resolution=node'
  }]
};