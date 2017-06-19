var Simplify = require('simplify-commerce');

module.exports = config;

config.mongoUri = 'mongodb://test:test@ds033607.mlab.com:33607/heroku_fbnj3c1m';

config.SimplifyPay = Simplify.getClient({
    publicKey: 'INSERT YOUR SIMPLIFY PUBLIC KEY',
    privateKey: 'INSERT YOUR SIMPLIFY PRIVATE KEY'
});
